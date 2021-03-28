const esbuild = require(`esbuild`)

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */

const [env] = process.argv.slice(2)
const log = (target, result) => console.log(`${target} built with the following results:`, result)
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
esbuild.build(appConfig).then((result) => {
  log(`App`, result)
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
esbuild.build(electronMainConfig).then((result) => {
  log(`Main for Electron`, result)
})
/**
 * @type {BuildOptions}
 */
const electronPreloadConfig = {
  ...baseElectronConfig,
  entryPoints: [`electron/preload.ts`],
}
esbuild.build(electronPreloadConfig).then((result) => {
  log(`Preload for Electron`, result)
})
