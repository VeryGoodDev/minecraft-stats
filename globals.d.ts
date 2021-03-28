declare var statFileApi: {
  getMinecraftPath(): string
  setMinecraftPath(path: string): void
  deleteMinecraftPath(): void
  getWorldNames(): string[]
  getWorldStats(worldName: string): object
}
