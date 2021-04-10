const { exec } = require(`child_process`)
const { performance } = require(`perf_hooks`)
const runBuild = require(`./esbuild`)

const buildStart = performance.now()
runBuild().then(() => {
  const buildTime = (performance.now() - buildStart).toFixed(4)
  console.log(`Finished all builds in ${buildTime} milliseconds. Starting electron now`)
  exec(`yarn start:electron`, { windowsHide: true }, (error) => {
    if (error) {
      console.error(`Error running \`yarn start:electron\`:`, error)
    }
    process.exit(0)
  })
})
