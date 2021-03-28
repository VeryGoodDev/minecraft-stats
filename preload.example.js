const path = require(`path`)
const fs = require(`fs`).promises

const MC_PATH = path.resolve(`/Users/Kenobi/AppData/Roaming/.minecraft`)
const MC_SAVES_PATH = path.join(MC_PATH, `/saves`)

// TODO: Want to render a Preact app to make multiple views easier with routing
window.addEventListener(`DOMContentLoaded`, async () => {
  const container = document.querySelector(`.dynamic`)
  const worlds = await fs.readdir(MC_SAVES_PATH)
  worlds.forEach((worldName) => {
    const div = document.createElement(`div`)
    div.style.fontStyle = `italic`
    div.href = `./world.html?worldName=${encodeURIComponent(worldName)}`
    div.textContent = worldName
    container.appendChild(div)
  })
  // const statsFilePaths = worlds.map((worldName) => path.join(MC_SAVES_PATH, worldName, `/stats`))
  // const [firstPath] = statsFilePaths
  // const [statsFileName] = await fs.readdir(firstPath)
  // const statsFilePath = path.join(firstPath, statsFileName)
  // const statsContentsRaw = await fs.readFile(statsFilePath)
  // const { stats } = JSON.parse(statsContentsRaw)
  // Object.keys(stats).forEach((key) => {
  //   const div = document.createElement(`div`)
  //   div.innerHTML = `<h2>${key}</h2>`
  //   Object.keys(stats[key])
  //     .sort((a, b) => {
  //       return stats[key][b] - stats[key][a]
  //     })
  //     .forEach((subkey) => {
  //       const stat = document.createElement(`div`)
  //       stat.textContent = `${key} - ${subkey}: ${stats[key][subkey]}`
  //       div.appendChild(stat)
  //     })
  //   container.appendChild(div)
  // })
})
