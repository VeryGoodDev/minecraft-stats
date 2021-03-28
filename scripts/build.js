/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */

const [env] = process.argv.slice(2)
/**
 * @type {BuildOptions}
 */
const baseConfig = {
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
const devConfig = {
  ...baseConfig,
  sourcemap: true,
}
/**
 * @type {BuildOptions}
 */
const prodConfig = {
  ...baseConfig,
  minify: true,
}
require(`esbuild`).buildSync(env === `--prod` ? prodConfig : devConfig)
