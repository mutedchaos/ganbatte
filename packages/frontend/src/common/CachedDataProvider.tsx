import React, { useContext, useMemo } from 'react'
import { ReactNode } from 'react'
import { GraphQLTaggedNode, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { DataCtx, useAppData } from '../AppData'

export type CachedEntityType = keyof DataCtx

interface Ctx {
  parent: Ctx | null
  entity: CachedEntityType
  data: any
}

interface Props {
  entity: CachedEntityType
  children: ReactNode
  query: GraphQLTaggedNode
}

const context = React.createContext<Ctx | null>(null as any)

type ResponseOf<T extends CachedEntityType> = NonNullable<DataCtx[T]> extends PreloadedQuery<infer U>
  ? U['response']
  : never

export default function CachedDataProvider({ children, entity, query }: Props) {
  const parent = useContext(context)
  const data = usePreloadedQuery(query, useAppData()[entity] as any)
  const value = useMemo<Ctx>(
    () => ({
      parent,
      entity,
      data,
    }),
    [data, entity, parent]
  )
  return <context.Provider value={value}>{children}</context.Provider>
}

export function useCachedData<T extends CachedEntityType>(entity: T): ResponseOf<T> {
  let candidate = useContext(context)
  while (candidate) {
    if (candidate.entity === entity) {
      return candidate.data
    }
    candidate = candidate.parent
  }
  throw new Error('Entity not loaded: ' + entity)
}
