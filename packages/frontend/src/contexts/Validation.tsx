import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { useVaguelyUniqueId } from '../common/useVaguelyUniqueId'

interface ValidCtx {
  isValid: boolean
}

interface ControlCtx {
  register(key: string, isValid: boolean): void
  unregister(key: string): void
}

interface Validation {
  key: string
  isValid: boolean
}

const validContext = React.createContext<ValidCtx | null>(null)
const controlContext = React.createContext<ControlCtx | null>(null)

export function useIsFailingValidation() {
  return !useContext(validContext)?.isValid
}

interface ValidateableProps {
  children: ReactNode
  onValidate?(isValid: boolean): void
}

export function Validateable({ children, onValidate }: ValidateableProps) {
  const [validations, setValidations] = useState<Validation[]>([])
  const validValue = useMemo<ValidCtx>(
    () => ({
      isValid: validations.every((v) => v.isValid),
    }),
    [validations]
  )

  const controlValue = useMemo<ControlCtx>(
    () => ({
      register(key, isValid) {
        setValidations((old) => [...old, { key, isValid }])
      },
      unregister(key) {
        setValidations((old) => old.filter((x) => x.key !== key))
      },
    }),
    []
  )

  useEffect(() => {
    onValidate?.(validValue.isValid)
  }, [onValidate, validValue.isValid])

  return (
    <controlContext.Provider value={controlValue}>
      <validContext.Provider value={validValue}>{children}</validContext.Provider>
    </controlContext.Provider>
  )
}

export function useValidation(isValid: boolean) {
  const control = useContext(controlContext)
  const key = useVaguelyUniqueId()

  useEffect(() => {
    if (!control) {
      if (isValid) return
      throw new Error('Validation not set up')
    }
    control.register(key, isValid)
    return () => {
      control.unregister(key)
    }
  }, [control, isValid, key])
}
