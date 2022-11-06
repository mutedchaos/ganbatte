import React, { ReactNode, useEffect } from 'react'
import { GraphQLTaggedNode, usePreloadedQuery } from 'react-relay'

import { useAppData, useAppLoaders } from '../AppData'
import LoadingIndicator from '../components/LoadingIndicator'
import { CachedEntityType, useCachedData, useDataCache } from './CachedDataProvider'

type SupportedEntity = CachedEntityType

interface Props {
  children: ReactNode
  entity: SupportedEntity
  id?: string
  query: GraphQLTaggedNode
  requiredKey?: string
}

export default function EnsureLoaded({ children, entity, id, query, requiredKey }: Props) {
  const loaders = useAppLoaders()
  useEffect(() => {
    const loader = loaders[entity]
    if (!takesNoArg(loader)) {
      if (!id) throw new Error('Id required but not given')
      loader(id)
    } else {
      loader()
    }
  }, [entity, id, loaders])
  const queryRef = useAppData()[entity]

  if (!queryRef) return <LoadingIndicator />

  return (
    <Cacher query={query} entity={entity} requiredKey={requiredKey}>
      {children}
    </Cacher>
  )
}

interface CacherProps {
  children: ReactNode
  query: GraphQLTaggedNode
  entity: SupportedEntity
  requiredKey?: string
}

function Cacher({ children, query, entity, requiredKey }: CacherProps) {
  const data = usePreloadedQuery(query, useAppData()[entity] as any)
  useDataCache(entity, data as any)
  const entry: any = useCachedData(entity)
  if (!entry || (requiredKey && !entry[requiredKey])) return <LoadingIndicator />
  return <>{children}</>
}

function takesNoArg(fn: (() => void) | ((id: string) => void)): fn is () => void {
  return fn.length === 0
}
