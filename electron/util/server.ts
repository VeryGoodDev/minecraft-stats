import { exec } from 'child_process'
import { BrowserWindow, dialog, ipcMain } from 'electron'
import { homedir } from 'os'
import * as path from 'path'

const HOME_DIR = homedir()

export function runCmd(cmd: string): Promise<{ stdout: string; stdin: string }> {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stdin) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stdin })
      }
    })
  })
}
// WARNING: This should only be used in a Main process; BrowserWindow and dialog are both unavailable in a Renderer process, and this function will fail.
export async function getUserSelectedMinecraftPath(): Promise<{ canceled: boolean; newPath: string }> {
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (!currentWindow) return { canceled: true, newPath: `` }
  const {
    canceled,
    filePaths: [newPath],
  } = await dialog.showOpenDialog(currentWindow, {
    properties: [`openDirectory`, `showHiddenFiles`],
    defaultPath: getDefaultMinecraftPath(),
  })
  return { canceled, newPath }
}
export function setupIpcMainListeners(): void {
  ipcMain.on(`requestUserSelectedMinecraftPath`, async () => {
    const newPath = await getUserSelectedMinecraftPath()
    BrowserWindow.getFocusedWindow()?.webContents.send(`receiveUserSelectedMinecraftPath`, newPath)
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
}

// Locations based on https://minecraft.fandom.com/wiki/.minecraft#Locating_.minecraft
function getDefaultMinecraftPath(): string {
  // Windows (yes, even 64 bit, weird name)
  if (process.platform === `win32`) {
    // Not 100% sure if this env var always exists, so this falls back to where it should be as a default
    return process.env.APPDATA || path.resolve(`${HOME_DIR}/AppData/Roaming`)
  }
  // macOS
  if (process.platform === `darwin`) {
    return path.resolve(`${HOME_DIR}/Library/Application Support`)
  }
  // Assuming anything that isn't Windows or Mac is Linux
  return HOME_DIR
}
