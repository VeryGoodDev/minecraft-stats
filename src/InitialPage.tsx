import { configKeys } from '../electron/util/common'
import Redirect from './Redirect'

export default function InitialPage() {
  const mcPath = window.configApi.getConfigItem<string>(configKeys.MINECRAFT_PATH)
  if (!mcPath) return <Redirect to="/onboarding" />
  return <Redirect to="/settings" />
}
