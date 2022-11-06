import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PreloadedQuery } from 'react-relay'

import { DataCtx } from '../AppData'
import { ChildrenOnlyProps } from './ChildrenOnlyProps'
import { getVaguelyUniqueId } from './useVaguelyUniqueId'

export type CachedEntityType = keyof DataCtx

interface Ctx {
  add(type: CachedEntityType, data: unknown): string
  remove(key: string): void
  get(type: CachedEntityType): unknown | null
}

interface Entry {
  key: string
  type: CachedEntityType
  data: unknown
}

const context = React.createContext<Ctx>(null as any)

type ResponseOf<T extends CachedEntityType> = NonNullable<DataCtx[T]> extends PreloadedQuery<infer U>
  ? U['response']
  : never

export function DataCacheProvider({ children }: ChildrenOnlyProps) {
  const [state, setState] = useState<Entry[]>([])

  const add = useCallback<Ctx['add']>((type, data) => {
    const key = getVaguelyUniqueId()
    setState((old) => [{ key, type, data }, ...old])
    return key
  }, [])

  const remove = useCallback<Ctx['remove']>((key) => {
    setState((old) => old.filter((x) => x.key !== key))
  }, [])

  const get = useCallback<Ctx['get']>(
    (type) => {
      return state.find((x) => x.type === type)?.data
    },
    [state]
  )

  const value = useMemo<Ctx>(
    () => ({
      add,
      remove,
      get,
    }),
    [add, get, remove]
  )

  return <context.Provider value={value}>{children}</context.Provider>
}

export function useDataCache<T extends CachedEntityType>(entityType: CachedEntityType, entity: ResponseOf<T>) {
  const { add, remove } = useContext(context)
  useEffect(() => {
    const key = add(entityType, entity)
    return () => {
      remove(key)
    }
  }, [add, entity, entityType, remove])
}

export function useCachedData<T extends CachedEntityType>(entity: T): ResponseOf<T> {
  const ctx = useContext(context)
  const obj = ctx.get(entity)
  if (obj === null) {
    throw new Error('Entity not loaded: ' + entity)
  }
  return obj as any
}
