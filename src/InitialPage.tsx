import Redirect from './Redirect'

export default function InitialPage() {
  const mcPath = window.statFileApi.getMinecraftPath()
  if (!mcPath) return <Redirect to="/settings" />
  return (
    <div>
      Minecraft path is <code>{mcPath}</code>
    </div>
  )
}
