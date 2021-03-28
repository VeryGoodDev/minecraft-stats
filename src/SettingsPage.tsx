import { useRequestMinecraftPath } from './serverDataHooks'

export default function SettingsPage() {
  const { isRequesting, minecraftPath, sendRequest } = useRequestMinecraftPath()
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
        Click Me
      </button>
    </>
  )
}
