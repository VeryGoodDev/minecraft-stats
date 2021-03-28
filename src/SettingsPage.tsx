import { useEffect } from 'preact/hooks'
import { configKeys } from '../electron/util/common'
import { useRequestMinecraftPath, useSupportedLanguages, useSupportedVersions } from './serverDataHooks'

export default function SettingsPage() {
  const { isLoading, minecraftPath, sendRequest } = useRequestMinecraftPath(
    window.configApi.getConfigItem(configKeys.MINECRAFT_PATH) || ``
  )
  const { isLoading: isLoadingLanguages, supportedLanguages } = useSupportedLanguages()
  const { isLoading: isLoadingVersions, supportedVersions } = useSupportedVersions()
  useEffect(() => {
    if (minecraftPath.length > 0) {
      window.configApi.updateConfigItem(configKeys.MINECRAFT_PATH, minecraftPath)
    }
  }, [minecraftPath])
  return (
    <>
      <h1>Settings</h1>
      {isLoading ? <div>Loading...</div> : null}
      <div>{minecraftPath || `No Minecraft path provided`}</div>
      <button
        type="button"
        onClick={() => {
          sendRequest()
        }}
      >
        Set Your Minecraft Path
      </button>
      {isLoadingLanguages ? (
        `Loading available languages...`
      ) : (
        <select onChange={console.log}>
          <option value="" selected disabled>
            Please choose a language
          </option>
          {Object.values(supportedLanguages ?? {}).map((languageInfo) => (
            <option value={languageInfo.iso}>{languageInfo.languageName}</option>
          ))}
        </select>
      )}
      {isLoadingVersions ? (
        `Loading available versions...`
      ) : (
        <select onChange={console.log}>
          <option value="" selected disabled>
            Please choose a version
          </option>
          {supportedVersions?.map((version) => (
            <option value={version}>{version}</option>
          ))}
        </select>
      )}
    </>
  )
}
