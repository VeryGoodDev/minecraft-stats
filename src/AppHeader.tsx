import { css, cx } from '@emotion/css'
import { useState } from 'preact/hooks'
import Helmet from 'react-helmet'
import useWindowIsMaximized from './useWindowIsMaximized'

// FIXME: Different title bar style/buttons for Mac/Linux?
const DEFAULT_TITLE = `Minecraft Stats`
const headerCss = css`
  -webkit-app-region: drag;
  align-items: center;
  background-color: hsl(120deg 20% 50%);
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: auto 1fr auto;
  height: 32px; /* FIXME: Different for Mac/Linux? */
  margin: 0;
  padding: 0;
  width: 100vw;

  & > * {
    padding: 2px;
  }
`
const windowIconWrapperCss = css`
  padding-left: 6px;
`
const temporaryIconCss = css`
  --size: 20px;
  background-image: linear-gradient(to bottom, forestgreen 0%, forestgreen 33%, sienna 33%);
  height: var(--size);
  width: var(--size);
`
const windowTitleCss = css``
const windowTitleButtonWrapperCss = css`
  -webkit-app-region: no-drag;
  align-items: center;
  align-self: stretch;
  display: grid;
  grid-column-gap: 0;
  grid-template-columns: repeat(3, 1fr);
  padding: 0;
`
const windowTitleButtonCss = css`
  --hover-color: hsla(0, 0%, 100%, 0.5);
  background-color: transparent;
  border: none;
  border-radius: 0;
  height: 32px;
  padding: 0;
  position: relative;
  width: 36px;

  &:focus-visible,
  &:hover {
    background-color: var(--hover-color);
    outline: none;
  }
  &:focus {
    outline: none;
  }
`
const windowTitleCloseButtonCss = css`
  --hover-color: red;
`
const minimizeButtonIconCss = css`
  &::before {
    border-top: 2px solid black;
    bottom: 10px;
    content: '';
    left: 12px;
    position: absolute;
    width: 12px;
  }
`
const maximizeButtonIconCss = css`
  &::before {
    border: 2px solid black;
    content: '';
    height: 12px;
    left: 12px;
    position: absolute;
    top: 10px;
    width: 12px;
  }
`
const unmaximizeButtonIconCss = css`
  &::before {
    border: 2px solid black;
    content: '';
    height: 12px;
    left: 10px;
    position: absolute;
    top: 12px;
    width: 12px;
  }
  &::after {
    border: 2px solid black;
    clip-path: polygon(0 0, 16px 0, 16px 16px, 8px 16px, 8px 8px, 0 4px);
    content: '';
    height: 12px;
    left: 14px;
    position: absolute;
    top: 8px;
    width: 12px;
  }
`
const closeButtonIconCss = css`
  &::before,
  &::after {
    background-color: black;
    content: '';
    height: 17px;
    left: 18px;
    position: absolute;
    top: 8px;
    transform: rotate(45deg);
    width: 1.5px;
  }
  &::after {
    transform: rotate(-45deg);
  }
`
export default function AppHeader() {
  const [currentTitle, setCurrentTitle] = useState(DEFAULT_TITLE)
  const windowIsMaximized = useWindowIsMaximized()
  return (
    <>
      <Helmet title={currentTitle} onChangeClientState={({ title }) => setCurrentTitle(title)} />
      <header class={headerCss}>
        <div class={windowIconWrapperCss}>
          <div class={temporaryIconCss} />
        </div>
        <div class={windowTitleCss}>{currentTitle}</div>
        <div class={windowTitleButtonWrapperCss}>
          <button class={windowTitleButtonCss} onClick={window.windowControlApi.minimize} aria-label="Minimize window">
            <span class={minimizeButtonIconCss} />
          </button>
          <button class={windowTitleButtonCss} onClick={window.windowControlApi.toggleMaximize}>
            <span class={windowIsMaximized ? unmaximizeButtonIconCss : maximizeButtonIconCss} />
          </button>
          <button class={cx(windowTitleButtonCss, windowTitleCloseButtonCss)} onClick={window.windowControlApi.close}>
            <span class={closeButtonIconCss} />
          </button>
        </div>
      </header>
    </>
  )
}
