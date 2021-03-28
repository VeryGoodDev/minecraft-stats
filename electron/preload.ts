import Conf from 'conf'
import { contextBridge, ipcRenderer } from 'electron'
import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { configKeys } from './util/common'
import { runCmd } from './util/server'

const MC_TEST_PATH = `/Users/Kenobi/AppData/Roaming/.minecraft`
const MC_TEST_VERSION = `1.16.5`
const preferences = new Conf({
  defaults: {
    [configKeys.MINECRAFT_PATH]: ``,
    version: 1,
  },
})

function getConfigItem(key: string): unknown {
  return preferences.get(key)
}
function setConfigItem<T>(key: string, newValue: T): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      preferences.set(key, newValue)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
function deleteConfigItem(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      preferences.delete(key)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
function configHasKey(key: string): boolean {
  return preferences.has(key)
}
function updateConfigItem<T = unknown>(key: string, newValue: T): Promise<void> {
  if (!configHasKey(key)) {
    console.warn(`Attempting to update a non-existent config value of [${key}]`)
    return Promise.resolve()
  }
  return setConfigItem(key, newValue)
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
  getConfigItem,
  setConfigItem,
  deleteConfigItem,
  configHasKey,
  updateConfigItem,
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
