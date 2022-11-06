import { useMemo } from 'react'

let value = new Date().valueOf()

export function useVaguelyUniqueId() {
  return useMemo(() => getVaguelyUniqueId(), [])
}

export function getVaguelyUniqueId() {
  return (++value).toString()
}
