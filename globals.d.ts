declare var statFileApi: {
  getMinecraftPath(): string
  setMinecraftPath(path: string): void
  deleteMinecraftPath(): void
  getWorldNames(): string[]
  getWorldStats(worldName: string): object
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
