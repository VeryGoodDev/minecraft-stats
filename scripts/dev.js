const { exec } = require(`child_process`)
const runBuild = require(`./esbuild`)

runBuild().then(() => {
  exec(`yarn start:electron`, { windowsHide: true }, (error) => {
    if (error) {
      console.error(`Error running \`yarn start:electron\`:`, error)
    }
    process.exit(0)
  })
})
