import { injectGlobal } from '@emotion/css'

export default function injectGlobalStyles(): void {
  // eslint-disable-next-line @babel/no-unused-expressions
  injectGlobal`
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
    }
  `
}
