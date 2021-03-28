export const configKeys = {
  MINECRAFT_PATH: `minecraftPath`,
  MINECRAFT_VERSION: `minecraftVersion`,
  LANGUAGE_PREF: `languagePref`,
  CURRENT_LANGUAGE_STRINGS: `currentLanguageStrings`,
}
export function isVanillaVersion(version: string): boolean {
  return /^1\.\d+(\.\d+)?$/.test(version)
}
