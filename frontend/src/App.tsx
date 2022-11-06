import React from 'react'

import AppData from './AppData'
import { DataCacheProvider } from './common/CachedDataProvider'
import GlobalErrors from './components/GlobalErrors'
import { GlobalEditProvider } from './contexts/ActiveEditingContext'
import { EditorLockProvider } from './contexts/EditorLockContext'
import { ModalProvider } from './contexts/modal'
import { ConfirmationPopupProvider } from './contexts/useConfirmationPopup'
import { GlobalStyles } from './GlobalStyles'
import SuggestSavingChanges from './layouts/SuggestSavingChanges/SuggestSavingChanges'
import Authentication from './pages/authentication/Authentication'
import Router from './Router'

function App() {
  return (
    <div>
      <GlobalStyles />
      <ConfirmationPopupProvider>
        <ModalProvider>
          <Authentication>
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
          </Authentication>
        </ModalProvider>
      </ConfirmationPopupProvider>
      <GlobalErrors />
    </div>
  )
}

export default App
