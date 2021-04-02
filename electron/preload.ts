import { contextBridge, ipcRenderer } from 'electron'
import * as configApi from './exposedApis/config'
import * as configFileApi from './exposedApis/configFile'
import * as statFileApi from './exposedApis/statFile'

contextBridge.exposeInMainWorld(`configApi`, configApi)
contextBridge.exposeInMainWorld(`configFileApi`, configFileApi)
contextBridge.exposeInMainWorld(`statFileApi`, statFileApi)
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
  // Prevent file drag/drop
  document.addEventListener(`dragover`, (evt) => evt.preventDefault())
  document.addEventListener(`drop`, (evt) => evt.preventDefault())
})
