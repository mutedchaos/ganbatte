import React, { ReactNode, useEffect } from 'react'
import { GraphQLTaggedNode } from 'react-relay'
import { useAppData, useAppLoaders } from '../AppData'
import LoadingIndicator from '../components/LoadingIndicator'
import CachedDataProvider, { CachedEntityType } from './CachedDataProvider'

type SupportedEntity = CachedEntityType

interface Props {
  children: ReactNode
  entity: SupportedEntity
  id?: string
  query: GraphQLTaggedNode
}

export default function EnsureLoaded({ children, entity, id, query }: Props) {
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
    <CachedDataProvider entity={entity} query={query}>
      {children}
    </CachedDataProvider>
  )
}

function takesNoArg(fn: (() => void) | ((id: string) => void)): fn is () => void {
  return fn.length === 0
}
