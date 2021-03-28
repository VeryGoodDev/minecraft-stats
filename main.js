const { app, BrowserWindow, ipcMain, dialog } = require(`electron`)
const path = require(`path`)
const { getUserSelectedMinecraftPath } = require(`./electron/util.js`)

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 720,
    minWidth: 350,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, `build/electron/preload.js`),
      enableRemoteModule: false,
      contextIsolation: true,
    },
    title: `Minecraft Stats`,
  })
  // NOTE: If I find a need for the menu bar, it can be kept and hidden with autoHideMenuBar: true in the BrowserWindow constructor
  // win.removeMenu()
  win.loadFile(`src/index.html`)
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
ipcMain.on(`getUserSelectedMinecraftPath`, async () => {
  const newPath = await getUserSelectedMinecraftPath()
  console.log(newPath)
})
