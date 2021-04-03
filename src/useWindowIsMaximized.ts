import { useState } from 'preact/hooks'

export default function useWindowIsMaximized(): boolean {
  const [isMaximized, setIsMaximized] = useState<boolean>(false)
  window.serverDataApi.receive(`receiveWindowMaximizedStatus`, (result) => {
    if (result.success) {
      setIsMaximized(result.isMaximized)
    } else {
      console.error(`[useWindowIsMaximized] Error while trying to determine if the window is maximized:`, result.err)
    }
  })
  return isMaximized
}
