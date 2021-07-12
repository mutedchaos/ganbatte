import React, { ReactNode, useContext, useMemo } from 'react'
import { PreloadedQuery, useQueryLoader } from 'react-relay'

import {
  BusinessEntitiesQuery,
  default as BusinessEntitiesQueryImpl,
} from './pages/businessEntities/__generated__/BusinessEntitiesQuery.graphql'
import {
  BusinessEntityViewQuery,
  default as BusinessEntityViewQueryImpl,
} from './pages/businessEntities/BusinessEntityView/__generated__/BusinessEntityViewQuery.graphql'
import GamesQueryImpl, { GamesQuery } from './pages/games/__generated__/GamesQuery.graphql'
import { GameViewQuery, default as GameViewQueryImpl } from './pages/games/GameView/__generated__/GameViewQuery.graphql'
import { PlatformsQuery, default as PlatformsQueryImpl } from './pages/platforms/__generated__/PlatformsQuery.graphql'
import {
  PlatformViewQuery,
  default as PlatformViewQueryImpl,
} from './pages/platforms/PlatformView/__generated__/PlatformViewQuery.graphql'

interface Props {
  children: ReactNode
}

export interface DataCtx {
  games: PreloadedQuery<GamesQuery> | null | undefined
  game: PreloadedQuery<GameViewQuery> | null | undefined

  platforms: PreloadedQuery<PlatformsQuery> | null | undefined
  platform: PreloadedQuery<PlatformViewQuery> | null | undefined

  businessEntities: PreloadedQuery<BusinessEntitiesQuery> | null | undefined
  businessEntity: PreloadedQuery<BusinessEntityViewQuery> | null | undefined
}

interface LoadCtx {
  games(): void
  game(gameId: string): void
  platforms(): void
  platform(platformId: string): void
  businessEntities(): void
  businessEntity(businessEntityId: string): void
}

const dataContext = React.createContext<DataCtx>(null as any)
const loaderContext = React.createContext<LoadCtx>(null as any)

export default function AppData({ children }: Props) {
  const [games, loadGames] = useQueryLoader<GamesQuery>(GamesQueryImpl)
  const [game, loadGame] = useQueryLoader<GameViewQuery>(GameViewQueryImpl)

  const [platforms, loadPlatforms] = useQueryLoader<PlatformsQuery>(PlatformsQueryImpl)
  const [platform, loadPlatform] = useQueryLoader<PlatformViewQuery>(PlatformViewQueryImpl)

  const [businessEntities, loadBusinessEntities] = useQueryLoader<BusinessEntitiesQuery>(BusinessEntitiesQueryImpl)
  const [businessEntity, loadBusinessEntity] = useQueryLoader<BusinessEntityViewQuery>(BusinessEntityViewQueryImpl)

  const data = useMemo<DataCtx>(
    () => ({
      games,
      game,
      platforms,
      platform,
      businessEntities,
      businessEntity,
    }),
    [businessEntities, businessEntity, game, games, platform, platforms]
  )

  const loaders = useMemo<LoadCtx>(
    () => ({
      games() {
        loadGames({})
      },
      game(gameId: string) {
        loadGame({ gameId })
      },
      businessEntities() {
        loadBusinessEntities({})
      },
      businessEntity(businessEntityId: string) {
        loadBusinessEntity({ businessEntityId })
      },
      platforms() {
        loadPlatforms({})
      },
      platform(platformId: string) {
        loadPlatform({ platformId })
      },
    }),
    [loadBusinessEntities, loadBusinessEntity, loadGame, loadGames, loadPlatform, loadPlatforms]
  )

  return (
    <dataContext.Provider value={data}>
      <loaderContext.Provider value={loaders}>{children}</loaderContext.Provider>
    </dataContext.Provider>
  )
}

export function useAppData() {
  return useContext(dataContext)
}

export function useAppLoaders() {
  return useContext(loaderContext)
}
