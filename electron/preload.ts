import { contextBridge } from 'electron'
import * as configApi from './exposedApis/config'
import * as configFileApi from './exposedApis/configFile'
import * as statFileApi from './exposedApis/statFile'
import * as serverDataApi from './exposedApis/serverData'

contextBridge.exposeInMainWorld(`configApi`, configApi)
contextBridge.exposeInMainWorld(`configFileApi`, configFileApi)
contextBridge.exposeInMainWorld(`statFileApi`, statFileApi)
contextBridge.exposeInMainWorld(`serverDataApi`, serverDataApi)
contextBridge.exposeInMainWorld(`windowControlApi`, {
  minimize() {
    serverDataApi.receiveOnce(`receiveWindowMinimizeResult`, ({ success, err }) => {
      if (!success) {
        console.error(`Error returned from request requestWindowMinimize:`, err)
      }
    })
    serverDataApi.send(`requestWindowMinimize`)
  },
  toggleMaximize() {
    serverDataApi.receiveOnce(`receiveWindowToggleMaximizeResult`, ({ success, err }) => {
      if (!success) {
        console.error(`Error returned from request requestWindowToggleMaximize:`, err)
      }
    })
    serverDataApi.send(`requestWindowToggleMaximize`)
  },
  close() {
    window.close()
  },
  requestMaximizedStatus(timeout = 375) {
    return new Promise((resolve, reject) => {
      // prefer-const is broken for this for some reason, thinking that timeout is never reassigned even though it clearly is a little farther down
      // eslint-disable-next-line prefer-const
      let timeoutId: ReturnType<typeof setTimeout>
      console.time(`asking for maximized`)
      serverDataApi.receiveOnce(`receiveWindowMaximizedStatus`, (response) => {
        console.timeEnd(`asking for maximized`)
        clearTimeout(timeoutId)
        if (response.success) {
          resolve(response.isMaximized)
        } else {
          reject(response.err)
        }
      })
      serverDataApi.send(`requestWindowMaximizedStatus`)
      timeoutId = setTimeout(() => {
        reject(new Error(`Took too long to get maximized status`))
      }, timeout)
    })
  },
})
process.once(`loaded`, () => {
  // Prevent file drag/drop
  document.addEventListener(`dragover`, (evt) => evt.preventDefault())
  document.addEventListener(`drop`, (evt) => evt.preventDefault())
})
