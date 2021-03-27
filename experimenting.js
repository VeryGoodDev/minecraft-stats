const path = require(`path`)
const fs = require(`fs`).promises
const colors = require(`colors/safe`)

const MC_PATH = path.resolve(`/Users/Kenobi/AppData/Roaming/.minecraft`)
const MC_SAVES_PATH = path.join(MC_PATH, `/saves`)

async function go() {
  const worlds = await fs.readdir(MC_SAVES_PATH)
  const statsFilePaths = worlds.map((worldName) => path.join(MC_SAVES_PATH, worldName, `/stats`))
  const [firstPath] = statsFilePaths
  const [statsFileName] = await fs.readdir(firstPath)
  const statsFilePath = path.join(firstPath, statsFileName)
  const statsContentsRaw = await fs.readFile(statsFilePath)
  const { stats } = JSON.parse(statsContentsRaw)
  Object.keys(stats).forEach((key) => {
    console.group(colors.cyan(key))
    Object.keys(stats[key])
      .sort((a, b) => {
        return stats[key][b] - stats[key][a]
      })
      .forEach((subkey) => {
        console.log(`${subkey}:`, stats[key][subkey])
      })
    console.groupEnd()
  })
}
go()
