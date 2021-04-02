import { css } from '@emotion/css'
import { useEffect } from 'preact/hooks'
import { configKeys } from '../electron/util/common'
import { useRequestMinecraftPath, useSupportedLanguages, useSupportedVersions } from './serverDataHooks'
import EllipsisText from './ui/EllipsisText'

const settingPageLayoutCss = css`
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
`
const settingWrapperCss = css`
  display: grid;
  grid-row-gap: 4px;
`
const minecraftPathWrapperCss = css`
  align-items: center;
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: 1fr auto;
`
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
    <div class={settingPageLayoutCss}>
      <h1>Settings</h1>
      <div class={settingWrapperCss}>
        <h2>Minecraft Path</h2>
        <div class={minecraftPathWrapperCss}>
          <EllipsisText
            text={isLoading ? `Waiting for new path to be selected` : minecraftPath || `No Minecraft path provided`}
          />
          <button
            type="button"
            onClick={() => {
              sendRequest()
            }}
          >
            Change
          </button>
        </div>
      </div>
      <div class={settingWrapperCss}>
        <h2>Minecraft Version</h2>
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
      </div>
      <div class={settingWrapperCss}>
        <h2>Language</h2>
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
      </div>
    </div>
  )
}
