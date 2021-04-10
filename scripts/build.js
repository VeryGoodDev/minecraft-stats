const { performance } = require(`perf_hooks`)
const runBuild = require(`./esbuild`)

const start = performance.now()
runBuild({ watch: false }).then(() => {
  const bundleTime = (performance.now() - start).toFixed(4)
  console.log(`Built all bundles in ${bundleTime} milliseconds`)
})
