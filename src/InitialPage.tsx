import { configKeys } from '../electron/util/common'
import Redirect from './Redirect'

export default function InitialPage() {
  const mcPath = window.statFileApi.getConfigItem<string>(configKeys.MINECRAFT_PATH)
  // if (!mcPath) return <Redirect to="/settings" />
  return <Redirect to="/settings" />
  // return (
  //   <div>
  //     Minecraft path is <code>{mcPath}</code>
  //   </div>
  // )
}
