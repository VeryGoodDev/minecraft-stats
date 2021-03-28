declare var statFileApi: {
  getConfigItem<T>(key: string): T
  setConfigItem<T>(key: string, value: T): Promise<void>
  deleteConfigItem(): Promise<void>
  configHasKey(key: string): boolean
  updateConfigItem<T>(key: string, value: T): Promise<void>
  getWorldNames(): string[]
  getWorldStats(worldName: string): object
  getLangOptions(): string[]
}
declare var serverDataApi: {
  send(channel: string, data?: unknown): void
  receive(channel: string, handler: (...args: unknown[]) => void): void
  receiveOnce(channel: string, handler: (...args: unknown[]) => void): void
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
