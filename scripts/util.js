const { performance } = require(`perf_hooks`)

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */
/**
 *
 * @param {BuildOptions} defaults The main config setup
 * @param {BuildOptions} overrides Any options to override
 * @returns {BuildOptions}
 */
const combineConfigs = (defaults, overrides) => Object.assign(defaults, overrides)
/**
 *
 * @param {string} buildName Name of the build to be logged
 * @param {number} start Epoch timestamp of when the build was started
 */
const esbuildLog = (buildName, start) => {
  console.log(`${buildName} initially built in ${(performance.now() - start).toFixed(4)} milliseconds`)
}

module.exports = {
  combineConfigs,
  esbuildLog,
}
