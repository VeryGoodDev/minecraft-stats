import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { configKeys, isVanillaVersion } from '../util/common'
import { runCmd } from '../util/server'
import { getConfigItem } from './config'

interface IndexItem {
  hash: string
  size: number
}
interface IndexFileStructure {
  objects: Record<string, IndexItem>
}
interface LanguageInfo {
  iso: string
  languageName: string
  translationFileName: string
}

export function getSupportedVersions(): Promise<string[]> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH)
  return fsPromises
    .readdir(path.join(minecraftPath, `/versions`))
    .then((versions) => versions.filter((version) => isVanillaVersion(version)))
}
export function getSupportedLanguages(): Promise<Record<string, LanguageInfo>> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH)
  const minecraftVersion = getConfigItem(configKeys.MINECRAFT_VERSION).replace(/^(1\.\d+).*$/, `$1`)
  const indexFilePath = path.join(minecraftPath, `/assets/indexes/${minecraftVersion}.json`)
  return fsPromises
    .readFile(indexFilePath)
    .then((rawFile: Buffer) => JSON.parse(rawFile.toString()))
    .then((indexFile: IndexFileStructure) => getLanguagesFromIndexFile(indexFile.objects))
}

function getIsoFromFilename(filename: string): string {
  return filename.replace(/^.*\/(.*?)\.json$/, `$1`)
}
async function getLanguagesFromIndexFile(
  indexFileObjects: IndexFileStructure[`objects`]
): Promise<Record<string, LanguageInfo>> {
  const languageNames: Record<string, string> = await fsPromises
    .readFile(path.resolve(`../assets/lang-names.json`))
    .then((rawFile: Buffer) => JSON.parse(rawFile.toString()))
  return Object.keys(indexFileObjects).reduce((languages: Record<string, LanguageInfo>, key: string): Record<
    string,
    LanguageInfo
  > => {
    if (key.startsWith(`minecraft/lang`)) {
      const iso = getIsoFromFilename(key)
      const languageName = languageNames[iso]
      const translationFileName = indexFileObjects[key].hash
      if (languageName) {
        languages[iso] = { iso, languageName, translationFileName }
      }
    }
    return languages
  }, {})
}
async function getLanguagesFromMinecraftJar() {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH)
  const minecraftVersion = getConfigItem(configKeys.MINECRAFT_VERSION).replace(/^(1\.\d+).*$/, `$1`)
  const jarPath = path.join(minecraftPath, `/versions`, minecraftVersion, `${minecraftVersion}.jar`)
  const langPath = `assets/minecraft/lang/*.json`
  try {
    const result = await runCmd(`unzip -Z1 ${jarPath} ${langPath}`)
    return result.stdout.split(`\n`).filter(Boolean)
  } catch (err) {
    console.error(`An error occurred while retrieving the language file:`, err)
    return []
  }
}
