import Conf from 'conf'
import { contextBridge, ipcRenderer } from 'electron'
import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { runCmd } from './util'

const MC_TEST_PATH = `/Users/Kenobi/AppData/Roaming/.minecraft`
const MC_TEST_VERSION = `1.16.5`
const preferences = new Conf()

function getMinecraftPath(): string {
  return (preferences.get(`minecraftPath`) as string) ?? ``
}
function setMinecraftPath(newPath: string | void): void {
  preferences.set(`minecraftPath`, newPath)
}
function deleteMinecraftPath(): void {
  preferences.delete(`minecraftPath`)
}
function getWorldNames(): Promise<string[]> {
  return fsPromises.readdir(path.join(MC_TEST_PATH, `/saves`))
}
async function getWorldStats(worldName: string): Promise<MinecraftStats> {
  const statsPath: string = path.join(MC_TEST_PATH, `/saves`, worldName, `/stats`)
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
async function getLangOptions() {
  const jarPath = path.join(MC_TEST_PATH, `/versions`, MC_TEST_VERSION, `${MC_TEST_VERSION}.jar`)
  const langPath = `assets/minecraft/lang/*.json`
  try {
    const result = await runCmd(`unzip -Z1 ${jarPath} ${langPath}`)
    return result.stdout.split(`\n`).filter(Boolean)
  } catch (err) {
    console.error(`An error occurred while retrieving the language file:`, err)
    return []
  }
}

contextBridge.exposeInMainWorld(`statFileApi`, {
  getMinecraftPath,
  setMinecraftPath,
  deleteMinecraftPath,
  getWorldNames,
  getWorldStats,
  getLangOptions,
})
contextBridge.exposeInMainWorld(`serverDataApi`, {
  send: (channel: string, data?: unknown) => {
    ipcRenderer.send(channel, data)
  },
  receive: (channel: string, handler: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (evt, ...args) => handler(...args))
  },
  receiveOnce: (channel: string, handler: (...args: unknown[]) => void) => {
    ipcRenderer.once(channel, (evt, ...args) => handler(...args))
  },
})
process.once(`loaded`, () => {
  window.addEventListener(`message`, (evt) => {
    ipcRenderer.send(evt.data.type)
  })
})
