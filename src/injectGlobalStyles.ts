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
    main {
      margin: 0 auto;
      max-width: 700px;
      padding: 0 16px;
      width: 100vw;
    }
  `
}
