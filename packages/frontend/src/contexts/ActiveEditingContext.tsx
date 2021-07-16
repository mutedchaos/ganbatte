import React, { useCallback, useContext, useState } from 'react'
import { useEffect, useMemo, useReducer } from 'react'

import { ChildrenOnlyProps } from '../common/ChildrenOnlyProps'
import { useVaguelyUniqueId } from '../common/useVaguelyUniqueId'

interface GlobalEditState {
  isDirty: boolean
  isValid: boolean
  onReset(): void
  onSave(): Promise<void>
}

type GlobalEditRegistrationCtx = {
  register(key: string, state: GlobalEditState): void
  unregister(key: string): void
}

type GlobalEditStateCtx = {
  resetAllChanges(): void
  saveAllChanges(): void
  isDirty: boolean
  isValid: boolean
  isSaving: boolean
}
export const globalEditContext = React.createContext<GlobalEditStateCtx>(null as any)
export const globalEditRegistrationContext = React.createContext<GlobalEditRegistrationCtx>(null as any)

export function GlobalEditProvider({ children }: ChildrenOnlyProps) {
  interface State {
    [key: string]: GlobalEditState
  }
  const [editors, setEditors] = useState<State>({})
  const [isSaving, setIsSaving] = useState(false)

  const register = useCallback<GlobalEditRegistrationCtx['register']>((key, state) => {
    setEditors((old) => ({ ...old, [key]: state }))
  }, [])

  const unregister = useCallback<GlobalEditRegistrationCtx['unregister']>((key) => {
    setEditors((old) => {
      const { [key]: toRemove, ...rest } = old
      return rest
    })
  }, [])

  const resetAllChanges = useCallback<GlobalEditStateCtx['resetAllChanges']>(() => {
    for (const editor of Object.values(editors)) {
      editor.onReset()
    }
  }, [editors])

  const saveAllChanges = useCallback<GlobalEditStateCtx['saveAllChanges']>(async () => {
    setIsSaving(true)
    try {
      for (const editor of Object.values(editors)) {
        await editor.onSave()
      }
    } finally {
      setIsSaving(false)
    }
  }, [editors])

  const value1 = useMemo<GlobalEditStateCtx>(
    () => ({
      isDirty: Object.values(editors).some((editor) => editor.isDirty),
      isValid: Object.values(editors).every((editor) => editor.isValid),

      resetAllChanges,
      saveAllChanges,
      isSaving,
    }),
    [editors, isSaving, resetAllChanges, saveAllChanges]
  )

  const value2 = useMemo<GlobalEditRegistrationCtx>(
    () => ({
      register,
      unregister,
    }),
    [register, unregister]
  )
  return (
    <globalEditContext.Provider value={value1}>
      <globalEditRegistrationContext.Provider value={value2}>{children}</globalEditRegistrationContext.Provider>
    </globalEditContext.Provider>
  )
}

function useGlobalEdit(state: GlobalEditState) {
  const key = useVaguelyUniqueId()
  const globalEdit = useContext(globalEditRegistrationContext)
  useEffect(() => {
    globalEdit.register(key, state)
    return () => {
      globalEdit.unregister(key)
    }
  }, [globalEdit, key, state])
}

export interface EditingOptions<TState> {
  customReducer?(state: TState, mod: Partial<TState>): TState
}

export function useEditing<TState>(
  pristineState: TState,
  onSave: (state: TState) => Promise<void>,
  options?: EditingOptions<TState>
) {
  const [state, updateState] = useReducer(
    options?.customReducer ?? ((old: TState, mod: Partial<TState>) => ({ ...old, ...mod })),
    pristineState
  )

  const isDirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(pristineState), [pristineState, state])
  const [isValid, setIsValid] = useState(true)

  const onReset = useCallback(() => {
    updateState(pristineState)
  }, [pristineState])

  const handleSave = useCallback(() => {
    return onSave(state)
  }, [onSave, state])

  useGlobalEdit(
    useMemo(
      () => ({
        isDirty,
        isValid,
        onReset,
        onSave: handleSave,
      }),
      [handleSave, isDirty, isValid, onReset]
    )
  )

  return useMemo(() => ({ state, updateState, validate: setIsValid }), [state])
}
