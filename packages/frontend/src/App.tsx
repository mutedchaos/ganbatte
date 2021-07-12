import React from 'react'

import AppData from './AppData'
import { GlobalStyles } from './GlobalStyles'
import Router from './Router'

// import { graphql } from 'babel-plugin-relay/macro'

function App() {
  return (
    <div>
      <GlobalStyles />
      <AppData>
        <Router />
      </AppData>
    </div>
  )
}

export default App
