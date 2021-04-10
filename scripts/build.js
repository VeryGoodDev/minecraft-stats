const { performance } = require(`perf_hooks`)
const runBuild = require(`./esbuild`)

const start = performance.now()
runBuild().then(() => {
  const bundleTime = (performance.now() - start).toFixed(4)
  console.log(`Building all bundles took ${bundleTime} milliseconds`)
})
