export const configKeys = {
  MINECRAFT_PATH: `minecraftPath`,
  MINECRAFT_VERSION: `minecraftVersion`,
  LANGUAGE_PREF: `languagePref`,
}
export function isVanillaVersion(version: string): boolean {
  return /^1\.\d+(\.\d+)?$/.test(version)
}
