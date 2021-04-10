export const configKeys = {
  MINECRAFT_PATH: `minecraftPath`,
  MINECRAFT_VERSION: `minecraftVersion`,
  LANGUAGE_PREF: `languagePref`,
  CURRENT_LANGUAGE_STRINGS: `currentLanguageStrings`,
}
export function isVanillaVersion(version: string): boolean {
  return /^1\.\d+(\.\d+)?$/.test(version)
}
export function random(min: number, max: number): number {
  return min + Math.ceil(Math.random() * (max - min))
}
