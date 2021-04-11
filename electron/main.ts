import { app, BrowserWindow } from 'electron'
import electronReload from 'electron-reload'
import * as path from 'path'
import { setupIpcMainListeners, startServer } from './util/server'

electronReload(path.join(`./build/**/*.js`))
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 720,
    minWidth: 350,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, `./preload.js`),
      enableRemoteModule: false,
      contextIsolation: true,
      // This is false by default for the past several Electron versions, but I'd rather explicitly set it anyways just in case it ever changes, isn't assumed, etc.
      nodeIntegration: false,
    },
    title: `Minecraft Stats`,
    titleBarStyle: `hidden`,
    frame: false,
    show: false,
  })
  // NOTE: If I find a need for the menu bar, it can be kept and hidden with autoHideMenuBar: true in the BrowserWindow constructor
  // win.removeMenu()
  win.loadFile(`src/index.html`)
  win.once(`ready-to-show`, () => {
    win.show()
  })
  win.on(`maximize`, () => {
    win.webContents.send(`receiveWindowMaximizedStatus`, { success: true, isMaximized: true })
  })
  win.on(`unmaximize`, () => {
    win.webContents.send(`receiveWindowMaximizedStatus`, { success: true, isMaximized: false })
  })
}
app.whenReady().then(async () => {
  // const server = await startServer()
  createWindow()
  setupIpcMainListeners()
})
app.on(`window-all-closed`, () => {
  if (process.platform !== `darwin`) {
    app.quit()
  }
})
