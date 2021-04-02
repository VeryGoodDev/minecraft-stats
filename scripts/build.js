const esbuild = require(`esbuild`)
const aliasPlugin = require(`esbuild-plugin-alias`)
const { performance } = require(`perf_hooks`)

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */

const start = performance.now()
const [env] = process.argv.slice(2)
const log = (target) => console.log(`${target} built in ${(performance.now() - start).toFixed(4)} milliseconds`)
// App compilation
/**
 * @type {BuildOptions}
 */
const baseAppConfig = {
  entryPoints: [`src/index.tsx`],
  outdir: `build`,
  bundle: true,
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
const appConfig = env === `--prod` ? prodAppConfig : devAppConfig
const appBuild = esbuild.build(appConfig).then(() => {
  log(`App`)
})
// Electron preload compilation
/**
 * @type {BuildOptions}
 */
const baseElectronConfig = {
  outdir: `build/electron`,
  platform: `node`,
  target: [`node12`],
  bundle: true,
  minify: true,
  external: [`electron`],
}
/**
 * @type {BuildOptions}
 */
const electronMainConfig = {
  ...baseElectronConfig,
  entryPoints: [`electron/main.ts`],
}
const electronMainBuild = esbuild.build(electronMainConfig).then(() => {
  log(`Main for Electron`)
})
/**
 * @type {BuildOptions}
 */
const electronPreloadConfig = {
  ...baseElectronConfig,
  entryPoints: [`electron/preload.ts`],
}
const electronPreloadBuild = esbuild.build(electronPreloadConfig).then(() => {
  log(`Preload for Electron`)
})
Promise.all([appBuild, electronMainBuild, electronPreloadBuild]).then(() => {
  const now = performance.now()
  const bundleTime = (now - start).toFixed(4)
  console.log(`Building all bundles took ${bundleTime} milliseconds`)
})
