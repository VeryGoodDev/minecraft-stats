import { css } from '@emotion/css'
import EllipsisText from './ui/EllipsisText'
import type { useRequestMinecraftPath, useSupportedLanguages, useSupportedVersions } from './serverDataHooks'

const minecraftPathWrapperCss = css`
  align-items: center;
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: 1fr auto;
`
export function SelectMinecraftPath({
  isLoading,
  minecraftPath,
  sendRequest,
}: ReturnType<typeof useRequestMinecraftPath>) {
  return (
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
  )
}
export function SelectVersion({
  isLoading,
  supportedVersions,
  selectedVersion,
  updateSelectedVersion,
}: ReturnType<typeof useSupportedVersions>) {
  return isLoading ? (
    <>Loading available versions...</>
  ) : (
    <select
      onChange={(evt) => {
        const target = evt.target as HTMLSelectElement
        updateSelectedVersion(target.selectedOptions[0].value)
      }}
    >
      {selectedVersion ? null : (
        <option value="" selected disabled>
          Please choose a version
        </option>
      )}
      {supportedVersions?.map((version) => (
        <option value={version} selected={version === selectedVersion}>
          {version}
        </option>
      ))}
    </select>
  )
}
export function SelectLanguage({
  isLoading,
  supportedLanguages,
  selectedLanguage,
  updateSelectedLanguage,
}: ReturnType<typeof useSupportedLanguages>) {
  return isLoading ? (
    <>Loading available languages...</>
  ) : (
    <select
      onChange={(evt) => {
        const target = evt.target as HTMLSelectElement
        updateSelectedLanguage(target.selectedOptions[0].value)
      }}
    >
      {selectedLanguage ? null : (
        <option value="" selected disabled>
          Please choose a language
        </option>
      )}
      {Object.values(supportedLanguages ?? {}).map((languageInfo) => (
        <option value={languageInfo.iso} selected={languageInfo.iso === selectedLanguage}>
          {languageInfo.languageName}
        </option>
      ))}
    </select>
  )
}
