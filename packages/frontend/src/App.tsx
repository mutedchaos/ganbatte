import React from 'react'

import AppData from './AppData'
import { GlobalEditProvider } from './contexts/ActiveEditingContext'
import { EditorLockProvider } from './contexts/EditorLockContext'
import { GlobalStyles } from './GlobalStyles'
import SuggestSavingChanges from './layouts/SuggestSavingChanges/SuggestSavingChanges'
import Router from './Router'

// import { graphql } from 'babel-plugin-relay/macro'

function App() {
  return (
    <div>
      <GlobalStyles />
      <AppData>
        <EditorLockProvider>
          <GlobalEditProvider>
            <SuggestSavingChanges />
            <Router />
          </GlobalEditProvider>
        </EditorLockProvider>
      </AppData>
    </div>
  )
}

export default App
