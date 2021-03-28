import { render } from 'preact'
import App from './App'

render(
  <App />,
  // Casting with as because I know this will always be there
  document.querySelector(`#root`) as Element
)
