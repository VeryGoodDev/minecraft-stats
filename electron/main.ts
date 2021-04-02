import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { getUserSelectedMinecraftPath } from './util/server'

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
    },
    title: `Minecraft Stats`,
    show: false,
  })
  // NOTE: If I find a need for the menu bar, it can be kept and hidden with autoHideMenuBar: true in the BrowserWindow constructor
  // win.removeMenu()
  win.loadFile(`src/index.html`)
  win.once(`ready-to-show`, () => {
    win.show()
  })
}
app.whenReady().then(() => {
  createWindow()
  app.on(`activate`, () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on(`window-all-closed`, () => {
  if (process.platform !== `darwin`) {
    app.quit()
  }
})
ipcMain.on(`requestUserSelectedMinecraftPath`, async () => {
  const newPath = await getUserSelectedMinecraftPath()
  BrowserWindow.getFocusedWindow()?.webContents.send(`receiveUserSelectedMinecraftPath`, newPath)
})
