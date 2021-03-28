import { render } from 'preact'

render(
  <>
    <div>Preact</div>
  </>,
  // Casting with as because I know this will always be there
  document.querySelector(`#root`) as Element
)
