import Router, { Route } from 'preact-router'
import { lazy, Suspense } from 'preact/compat'
import AppHeader from './AppHeader'
import AppNav from './AppNav'
import injectGlobalStyles from './injectGlobalStyles'

const InitialPage = lazy(() => import(`./InitialPage`))
const SettingsPage = lazy(() => import(`./SettingsPage`))

injectGlobalStyles()
export default function App() {
  return (
    <>
      <AppHeader />
      <AppNav />
      <main>
        <Suspense fallback="Loading...">
          <Router>
            <Route default component={InitialPage} />
            <Route path="/settings" component={SettingsPage} />
            {/* <Route path="/world-selection" /> */}
            {/* <Route path="/stats/:world" /> */}
          </Router>
        </Suspense>
      </main>
    </>
  )
}
