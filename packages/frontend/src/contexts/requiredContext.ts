import React, { useContext } from 'react'

export interface RequiredCtx {
  setRequired(state: boolean): void
}

export const requiredContext = React.createContext<RequiredCtx | null>(null)

export function useSetRequired(isRequired: boolean) {
  return useContext(requiredContext)?.setRequired(isRequired)
}
