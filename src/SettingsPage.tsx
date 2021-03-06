import { css } from '@emotion/css'
import { Helmet } from 'react-helmet'
import { SelectLanguage, SelectMinecraftPath, SelectVersion } from './configComponents'
import { useRequestMinecraftPath, useSupportedLanguages, useSupportedVersions } from './serverDataHooks'

const settingPageLayoutCss = css`
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
`
const settingWrapperCss = css`
  display: grid;
  grid-row-gap: 4px;
`
export default function SettingsPage() {
  const requestMinecraftPath = useRequestMinecraftPath()
  const { minecraftPath } = requestMinecraftPath
  const supportedVersions = useSupportedVersions(minecraftPath)
  const supportedLanguages = useSupportedLanguages(supportedVersions.selectedVersion)
  return (
    <>
      <Helmet title="Minecraft Stats - Settings" />
      <div class={settingPageLayoutCss}>
        <h1>Settings</h1>
        <div class={settingWrapperCss}>
          <h2>Minecraft Path</h2>
          <SelectMinecraftPath {...requestMinecraftPath} />
        </div>
        <div class={settingWrapperCss}>
          <h2>Minecraft Version</h2>
          <SelectVersion {...supportedVersions} />
        </div>
        <div class={settingWrapperCss}>
          <h2>Language</h2>
          <SelectLanguage {...supportedLanguages} />
        </div>
      </div>
    </>
  )
}
