const { performance } = require(`perf_hooks`)

const esbuildLog = (target, start) =>
  console.log(`${target} initially built in ${(performance.now() - start).toFixed(4)} milliseconds`)

module.exports = {
  esbuildLog,
}
