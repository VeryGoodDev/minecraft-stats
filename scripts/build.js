const esbuild = require(`esbuild`)
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
esbuild.build(env === `--prod` ? prodConfig : devConfig).then((result) => {
  console.log(`App built with the following results:`, result)
})
esbuild
  .build({
    entryPoints: [`electron/preload.ts`],
    outdir: `build/electron`,
    bundle: true,
    target: [`node12`],
    platform: `node`,
    external: [`electron`],
  })
  .then((result) => {
    console.log(`Preload for Electron built with the following results:`, result)
  })
