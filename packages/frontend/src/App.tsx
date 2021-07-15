import React from 'react'

import AppData from './AppData'
import { DataCacheProvider } from './common/CachedDataProvider'
import { GlobalEditProvider } from './contexts/ActiveEditingContext'
import { EditorLockProvider } from './contexts/EditorLockContext'
import { ModalProvider } from './contexts/modal'
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
        <ModalProvider>
          <AppData>
            <DataCacheProvider>
              <EditorLockProvider>
                <GlobalEditProvider>
                  <SuggestSavingChanges />
                  <Router />
                </GlobalEditProvider>
              </EditorLockProvider>
            </DataCacheProvider>
          </AppData>
        </ModalProvider>
      </ConfirmationPopupProvider>
    </div>
  )
}

export default App
