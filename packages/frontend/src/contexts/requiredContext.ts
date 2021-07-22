import React, { useContext, useEffect } from 'react'

export interface RequiredCtx {
  setRequired(state: boolean): void
}

export const requiredContext = React.createContext<RequiredCtx | null>(null)

export function useSetRequired(isRequired: boolean) {
  const requiredCtx = useContext(requiredContext)
  useEffect(() => {
    requiredCtx?.setRequired(isRequired)
  }, [isRequired, requiredCtx])
}
