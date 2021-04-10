interface LanguageInfo {
  iso: string
  languageName: string
  translationFileName?: string
  jarVersion?: string
}
declare var configApi: {
  getConfigItem<T>(key: string): T
  updateConfigItem<T>(key: string, value: T): Promise<void>
  // FIXME: All below this comment should be removed once dev is done
  setConfigItem<T>(key: string, value: T): Promise<void>
  deleteConfigItem(): Promise<void>
  resetConfig(): Promise<void>
}
declare var configFileApi: {
  getSupportedVersions(minecraftPath: string): Promise<string[]>
  getSupportedLanguages(version: string): Promise<Record<string, LanguageInfo>>
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
declare var windowControlApi: {
  minimize(): void
  toggleMaximize(): void
  close(): void
  requestMaximizedStatus(timeout?: number): Promise<{ success: boolean, isMaximized?: boolean, err?: Error }>
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
declare module 'electron-reload'
