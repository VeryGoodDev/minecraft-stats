import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { configKeys } from '../util/common'
import { getConfigItem } from './config'

export function getWorldNames(): Promise<string[]> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH)
  return fsPromises.readdir(path.join(minecraftPath, `/saves`))
}
export async function getWorldStats(worldName: string): Promise<MinecraftStats> {
  const minecraftPath = getConfigItem(configKeys.MINECRAFT_PATH)
  const statsPath: string = path.join(minecraftPath, `/saves`, worldName, `/stats`)
  const [fileName]: string[] = await fsPromises.readdir(statsPath)
  return (
    fsPromises
      .readFile(path.join(statsPath, fileName))
      .then((rawBuffer: Buffer): MinecraftStatsRaw => JSON.parse(rawBuffer.toString()))
      // TODO: Typing for Minecraft stats
      // TODO: Transform keys into more friendly names
      .then((rawData: MinecraftStatsRaw): MinecraftStats => rawData.stats)
  )
}
