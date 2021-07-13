import { useMemo } from 'react'

let value = new Date().valueOf()

export function useVaguelyUniqueId() {
  return useMemo(() => (++value).toString(), [])
}
