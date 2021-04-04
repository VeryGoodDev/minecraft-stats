import { useCallback, useEffect, useState } from 'preact/hooks'
import { configKeys } from '../electron/util/common'

export function useRequestMinecraftPath() {
  const [minecraftPath, setMinecraftPath] = useState<string>(
    window.configApi.getConfigItem(configKeys.MINECRAFT_PATH) || ``
  )
  const [isLoading, setIsLoading] = useState(false)
  const sendRequest = () => {
    setIsLoading(true)
  }
  useEffect(() => {
    if (minecraftPath.length > 0) {
      window.configApi.updateConfigItem(configKeys.MINECRAFT_PATH, minecraftPath)
    }
  }, [minecraftPath])
  useEffect(() => {
    if (isLoading) {
      window.serverDataApi.receiveOnce(`receiveUserSelectedMinecraftPath`, ({ canceled, newPath }) => {
        setIsLoading(false)
        if (!canceled) {
          setMinecraftPath(newPath)
        }
      })
      window.serverDataApi.send(`requestUserSelectedMinecraftPath`)
    }
  }, [isLoading])
  return { isLoading, minecraftPath, sendRequest }
}
export function useSupportedVersions(minecraftPath: string) {
  const [supportedVersions, setSupportedVersions] = useState<string[] | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>(
    window.configApi.getConfigItem(configKeys.MINECRAFT_VERSION) || ``
  )
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    window.configFileApi.getSupportedVersions(minecraftPath).then((versions) => {
      setSupportedVersions(versions)
      setIsLoading(false)
    })
  }, [minecraftPath])
  const updateSelectedVersion = useCallback((newSelection: string) => {
    setSelectedVersion((prevSelection) => {
      if (newSelection !== prevSelection) {
        window.configApi.setConfigItem(configKeys.MINECRAFT_VERSION, newSelection)
        return newSelection
      }
      return prevSelection
    })
  }, [])
  return { isLoading, supportedVersions, selectedVersion, updateSelectedVersion }
}
export function useSupportedLanguages(version: string) {
  const [supportedLanguages, setSupportedLanguages] = useState<Record<string, LanguageInfo> | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    window.configApi.getConfigItem(configKeys.LANGUAGE_PREF)
  )
  const [isLoading, setIsLoading] = useState(true)
  const updateSelectedLanguage = useCallback((newSelection: string) => {
    setSelectedLanguage((prevSelection) => {
      if (newSelection !== prevSelection) {
        window.configApi.setConfigItem(configKeys.LANGUAGE_PREF, newSelection)
        return newSelection
      }
      return prevSelection
    })
  }, [])
  useEffect(() => {
    setIsLoading(true)
    window.configFileApi.getSupportedLanguages(version).then((languages) => {
      setSupportedLanguages(languages)
      setIsLoading(false)
    })
  }, [version])
  return { isLoading, supportedLanguages, selectedLanguage, updateSelectedLanguage }
}
