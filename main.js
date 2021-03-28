const { app, BrowserWindow } = require(`electron`)
const path = require(`path`)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, `build/preload.js`),
    },
    title: `Minecraft Stats`,
  })
  // NOTE: If I find a need for the menu bar, it can be kept and hidden with autoHideMenuBar: true in the BrowserWindow constructor
  // win.removeMenu()
  win.loadFile(`index.html`)
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
