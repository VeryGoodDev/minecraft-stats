import { useEffect } from 'preact/hooks'
import { configKeys } from '../electron/util/common'
import { useRequestMinecraftPath } from './serverDataHooks'

export default function SettingsPage() {
  const { isRequesting, minecraftPath, sendRequest } = useRequestMinecraftPath(
    window.configApi.getConfigItem(configKeys.MINECRAFT_PATH) || ``
  )
  useEffect(() => {
    if (minecraftPath.length > 0) {
      window.configApi.updateConfigItem(configKeys.MINECRAFT_PATH, minecraftPath)
    }
  }, [minecraftPath])
  return (
    <>
      <h1>Settings</h1>
      {isRequesting ? <div>Loading...</div> : null}
      <div>{minecraftPath || `No Minecraft path provided`}</div>
      <button
        type="button"
        onClick={() => {
          sendRequest()
        }}
      >
        Set Your Minecraft Path
      </button>
    </>
  )
}
