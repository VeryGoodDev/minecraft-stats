interface LanguageInfo {
  iso: string
  languageName: string
  translationFileName?: string
  jarVersion?: string
}
declare var configApi: {
  getConfigItem<T>(key: string): T
  updateConfigItem<T>(key: string, value: T): Promise<void>
  setConfigItem<T>(key: string, value: T): Promise<void>
  deleteConfigItem(): Promise<void>
}
declare var configFileApi: {
  getSupportedVersions(): Promise<string[]>
  getSupportedLanguages(): Promise<Record<string, LanguageInfo>>
}
declare var statFileApi: {
  getWorldNames(): string[]
  getWorldStats(worldName: string): object
}
declare var serverDataApi: {
  send(channel: string, data?: unknown): void
  receive(channel: string, handler: (...args: any[]) => void): void
  receiveOnce(channel: string, handler: (...args: any[]) => void): void
}
declare interface MinecraftStats {
  "minecraft:custom": Record<string, number>
  "minecraft:killed": Record<string, number>
  "minecraft:picked_up": Record<string, number>
  "minecraft:killed_by": Record<string, number>
  "minecraft:broken": Record<string, number>
  "minecraft:crafted": Record<string, number>
  "minecraft:dropped": Record<string, number>
  "minecraft:mined": Record<string, number>
  "minecraft:used": Record<string, number>
}
declare interface MinecraftStatsRaw {
  stats: MinecraftStats
  DataVersion: number
}
