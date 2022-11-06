import React, { useContext, useEffect } from 'react'
import { useState } from 'react'

import { ChildrenOnlyProps } from '../common/ChildrenOnlyProps'

const isEditorLockedContext = React.createContext<boolean>(true)
const toggleEditorLockContext = React.createContext<(locked: boolean) => void>(null as any)

export function EditorLockProvider({ children }: ChildrenOnlyProps) {
  const [locked, setLocked] = useState(() => localStorage.getItem('ganbatte-locked') === '+')

  useEffect(() => {
    localStorage.setItem('ganbatte-locked', locked ? '+' : '-')
  })

  return (
    <toggleEditorLockContext.Provider value={setLocked}>
      <isEditorLockedContext.Provider value={locked}>{children}</isEditorLockedContext.Provider>
    </toggleEditorLockContext.Provider>
  )
}

export function useIsEditorLocked() {
  return useContext(isEditorLockedContext)
}

export function useToggleEditorLock() {
  return useContext(toggleEditorLockContext)
}
