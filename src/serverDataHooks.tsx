import { useEffect, useState } from 'preact/hooks'

export function useRequestMinecraftPath(initialPath: string) {
  const [minecraftPath, setMinecraftPath] = useState(initialPath)
  const [isLoading, setIsLoading] = useState(false)
  const sendRequest = () => {
    setIsLoading(true)
  }
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
export function useSupportedVersions() {
  const [supportedVersions, setSupportedVersions] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    window.configFileApi.getSupportedVersions().then((versions) => {
      setSupportedVersions(versions)
      setIsLoading(false)
    })
  }, [])
  return { isLoading, supportedVersions }
}
export function useSupportedLanguages() {
  const [supportedLanguages, setSupportedLanguages] = useState<Record<string, LanguageInfo> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    window.configFileApi.getSupportedLanguages().then((languages) => {
      setSupportedLanguages(languages)
      setIsLoading(false)
    })
  }, [])
  return { isLoading, supportedLanguages }
}
