const esbuild = require(`esbuild`)
const aliasPlugin = require(`esbuild-plugin-alias`)
const { performance } = require(`perf_hooks`)
const { esbuildLog, combineConfigs } = require(`./util`)

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 * @typedef {import('esbuild').BuildResult} BuildResult
 */
function logRebuild(buildName) {
  return (error) => {
    if (error) {
      console.error(`${buildName} failed to rebuild:`, error)
    } else {
      console.log(`${buildName} successfully rebuilt`)
    }
  }
}
/**
 * @type {BuildOptions}
 */
const baseAppConfig = {
  entryPoints: [`src/index.tsx`],
  outdir: `build`,
  bundle: true,
  watch: {
    onRebuild: logRebuild(`App`),
  },
  format: `esm`,
  inject: [`scripts/preact-shim.js`],
  target: [`chrome89`],
  external: [`react`],
  plugins: [
    aliasPlugin({
      react: require.resolve(`preact/compat`),
      'react-dom/test-utils': require.resolve(`preact/test-utils`),
      'react-dom': require.resolve(`preact/compat`),
    }),
  ],
  define: {
    'process.env.NODE_ENV': `'production'`,
  },
}
/**
 * @type {BuildOptions}
 */
const devAppConfig = {
  ...baseAppConfig,
  sourcemap: true,
}
/**
 * @type {BuildOptions}
 */
const prodAppConfig = {
  ...baseAppConfig,
  minify: true,
}
const baseElectronConfig = {
  outdir: `build/electron`,
  platform: `node`,
  target: [`node12`],
  bundle: true,
  minify: true,
  external: [`electron`, `electron-reload`],
}
/**
 * @type {BuildOptions}
 */
const electronMainConfig = {
  ...baseElectronConfig,
  entryPoints: [`electron/main.ts`],
  watch: {
    onRebuild: logRebuild(`Electron:main`),
  },
}
/**
 * @type {BuildOptions}
 */
const electronPreloadConfig = {
  ...baseElectronConfig,
  entryPoints: [`electron/preload.ts`],
  watch: {
    onRebuild: logRebuild(`Electron:preload`),
  },
}

/**
 * @param {BuildOptions} overrides Any overrides to pass to all configs
 * @returns {Promise<BuildResult[]>}
 */
module.exports = function runBuild(overrides = {}) {
  const buildStart = performance.now()
  const [env] = process.argv.slice(2)
  const appConfig = env === `--prod` ? prodAppConfig : devAppConfig
  const appBuild = esbuild.build(combineConfigs(appConfig, overrides)).then((result) => {
    esbuildLog(`App`, buildStart)
    return result
  })
  const electronMainBuild = esbuild.build(combineConfigs(electronMainConfig, overrides)).then((result) => {
    esbuildLog(`Electron:main`, buildStart)
    return result
  })
  const electronPreloadBuild = esbuild.build(combineConfigs(electronPreloadConfig, overrides)).then((result) => {
    esbuildLog(`Electron:main`, buildStart)
    return result
  })
  return Promise.all([appBuild, electronMainBuild, electronPreloadBuild])
}
