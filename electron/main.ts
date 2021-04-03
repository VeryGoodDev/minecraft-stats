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
ipcMain.on(`requestWindowMinimize`, () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  try {
    currentWindow?.minimize()
    currentWindow?.webContents.send(`receiveWindowMinimizeResult`, { success: true })
  } catch (err) {
    currentWindow?.webContents.send(`receiveWindowMinimizeResult`, { success: false, err })
  }
})
ipcMain.on(`requestWindowToggleMaximize`, () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  try {
    if (currentWindow?.isMaximized()) {
      currentWindow.unmaximize()
    } else if (currentWindow) {
      currentWindow.maximize()
    }
    currentWindow?.webContents.send(`receiveWindowToggleMaximizeResult`, { success: true })
  } catch (err) {
    currentWindow?.webContents.send(`receiveWindowToggleMaximizeResult`, { success: false, err })
  }
})
ipcMain.on(`requestWindowClose`, () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  try {
    currentWindow?.close()
  } catch (err) {
    currentWindow?.webContents.send(`receiveWindowCloseResult`, { success: false, err })
  }
})
ipcMain.on(`requestWindowMaximizedStatus`, () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  try {
    const isMaximized = currentWindow?.isMaximized()
    if (typeof isMaximized !== `boolean`) {
      throw new Error(`isMaximized could not be determined`)
    }
    currentWindow?.webContents.send(`receiveWindowMaximizedStatus`, { success: true, isMaximized })
  } catch (err) {
    currentWindow?.webContents.send(`receiveWindowMaximizedStatus`, { success: false, err })
  }
})
