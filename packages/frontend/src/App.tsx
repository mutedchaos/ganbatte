import React from 'react'

import AppData from './AppData'
import { GlobalEditProvider } from './contexts/ActiveEditingContext'
import { EditorLockProvider } from './contexts/EditorLockContext'
import { ConfirmationPopupProvider } from './contexts/useConfirmationPopup'
import { GlobalStyles } from './GlobalStyles'
import SuggestSavingChanges from './layouts/SuggestSavingChanges/SuggestSavingChanges'
import Router from './Router'

// import { graphql } from 'babel-plugin-relay/macro'

function App() {
  return (
    <div>
      <GlobalStyles />
      <ConfirmationPopupProvider>
        <AppData>
          <EditorLockProvider>
            <GlobalEditProvider>
              <SuggestSavingChanges />
              <Router />
            </GlobalEditProvider>
          </EditorLockProvider>
        </AppData>
      </ConfirmationPopupProvider>
    </div>
  )
}

export default App
