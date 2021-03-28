import { useEffect, useState } from 'preact/hooks'

export function useRequestMinecraftPath() {
  const [minecraftPath, setMinecraftPath] = useState(``)
  const [isRequesting, setIsRequesting] = useState(false)
  const sendRequest = () => {
    setIsRequesting(true)
  }
  useEffect(() => {
    if (isRequesting) {
      window.serverDataApi.receiveOnce(`receiveUserSelectedMinecraftPath`, (newPath) => {
        setIsRequesting(false)
        setMinecraftPath(newPath as string)
      })
      window.serverDataApi.send(`requestUserSelectedMinecraftPath`)
    }
  }, [isRequesting])
  return { isRequesting, minecraftPath, sendRequest }
}