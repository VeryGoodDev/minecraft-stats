import Conf from 'conf'
import { contextBridge } from 'electron'
import { promises as fsPromises } from 'fs'
import * as path from 'path'

const MC_TEST_PATH = `/Users/Kenobi/AppData/Roaming/.minecraft`
const preferences = new Conf()

function getMinecraftPath(): string {
  return preferences.get(`minecraftPath`) as string ?? ``
}
function setMinecraftPath(path: string | void): void {
  preferences.set(`minecraftPath`, path)
}
function deleteMinecraftPath(): void {
  preferences.delete(`minecraftPath`)
}
function getWorldNames(): Promise<string[]> {
  return fsPromises.readdir(path.join(MC_TEST_PATH, `/saves`))
}
async function getWorldStats(worldName: string): Promise<object> {
  const statsPath: string = path.join(MC_TEST_PATH, `/saves`, worldName, `/stats`)
  const [fileName]: string[] = await fsPromises.readdir(statsPath)
  return fsPromises.readFile(path.join(statsPath, fileName))
    .then((rawBuffer: Buffer) => JSON.parse(rawBuffer.toString()))
    // TODO: Typing for Minecraft stats
    // TODO: Transform keys into more friendly names
    .then((rawData: object): object => rawData)
}

contextBridge.exposeInMainWorld(`statFileApi`, {
  getMinecraftPath,
  setMinecraftPath,
  deleteMinecraftPath,
  getWorldNames,
  getWorldStats,
})
