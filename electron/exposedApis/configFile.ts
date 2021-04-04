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

export function getSupportedVersions(): Promise<string[]> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH) as string
  return fsPromises
    .readdir(path.join(minecraftPath, `/versions`))
    .then((versions) => versions.filter((version) => isVanillaVersion(version)))
}
export async function getSupportedLanguages(): Promise<Record<string, LanguageInfo>> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH) as string
  const minecraftVersion = (getConfigItem(configKeys.MINECRAFT_VERSION) as string).replace(/^(1\.\d+).*$/, `$1`)
  if (!minecraftVersion) return Promise.resolve({})
  const languageNames: Record<string, string> = await fsPromises
    .readFile(path.resolve(__dirname, `../../electron/assets/lang-names.json`))
    .then((rawFile: Buffer) => JSON.parse(rawFile.toString()))
  const indexFilePath = path.join(minecraftPath, `/assets/indexes/${minecraftVersion}.json`)
  return fsPromises
    .readFile(indexFilePath)
    .then((rawFile: Buffer) => JSON.parse(rawFile.toString()))
    .then((indexFile: IndexFileStructure) => getLanguagesFromIndexFile(indexFile.objects, languageNames))
}

function getIsoFromFilename(filename: string): string {
  return filename.replace(/^.*\/(.*?)\.json$/, `$1`)
}
async function getLanguagesFromIndexFile(
  indexFileObjects: IndexFileStructure[`objects`],
  languageNames: Record<string, string>
): Promise<Record<string, LanguageInfo>> {
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
  }, await getLanguagesFromMinecraftJar(languageNames))
}
async function getLanguagesFromMinecraftJar(
  languageNames: Record<string, string>
): Promise<Record<string, LanguageInfo>> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH) as string
  const minecraftVersion = getConfigItem(configKeys.MINECRAFT_VERSION) as string
  const jarPath = path.join(minecraftPath, `/versions`, minecraftVersion, `${minecraftVersion}.jar`)
  const langPath = `assets/minecraft/lang/*.json`
  try {
    const result = await runCmd(`unzip -Z1 ${jarPath} ${langPath}`)
    return result.stdout.split(`\n`).reduce((languages: Record<string, LanguageInfo>, languageFile: string) => {
      const iso = getIsoFromFilename(languageFile)
      const languageName = languageNames[iso]
      if (languageName) {
        languages[iso] = { iso, languageName, jarVersion: minecraftVersion }
      }
      return languages
    }, {})
  } catch (err) {
    console.error(`An error occurred while retrieving the language file:`, err)
    return {}
  }
}
