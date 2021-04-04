import { css, cx } from '@emotion/css'
import { Globe, Sliders } from 'phosphor-react'
import { Link as RouterLink } from 'preact-router'
import Match from 'preact-router/match'

const navCss = css`
  background-color: hsl(200deg 80% 25%);
  color: #fff;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0px, auto));
  justify-content: start;
`
export default function AppNav() {
  return (
    <nav class={navCss}>
      <Link href="/world-selection">
        <Globe color="currentColor" size={20} />
        <span>Worlds</span>
      </Link>
      <Link href="/settings">
        <Sliders color="currentColor" size={20} />
        <span>Settings</span>
      </Link>
    </nav>
  )
}
const navLinkCss = css`
  align-items: center;
  border-bottom: 4px solid transparent;
  color: inherit;
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: auto 1fr;
  padding: 8px 16px;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 125ms ease-in-out;

  &.nav-link-active {
    border-bottom-color: hsl(200deg 100% 75%);
  }
  &:focus,
  &:hover {
    background-color: hsla(0, 0%, 75%, 0.5);
    outline: none;
  }
`
function Link(props: Record<string, unknown>) {
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Match path={props.href as string}>
      {({ matches }: { matches: boolean }) => (
        <RouterLink {...props} class={cx(navLinkCss, matches ? `nav-link-active` : ``)} />
      )}
    </Match>
  )
}
