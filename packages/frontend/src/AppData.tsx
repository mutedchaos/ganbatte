import React, { ReactNode, useContext, useMemo } from 'react'
import { PreloadedQuery, useQueryLoader } from 'react-relay'

import {
  EnsurePlatformsAreLoadedQuery,
  default as EnsurePlatformsAreLoadedQueryImpl,
} from './components/loaders/__generated__/EnsurePlatformsAreLoadedQuery.graphql'
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
import { GenresQuery, default as GenresQueryImpl } from './pages/genres/__generated__/GenresQuery.graphql'
import {
  GenreViewQuery,
  default as GenreViewQueryImpl,
} from './pages/genres/GenreView/__generated__/GenreViewQuery.graphql'
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

  platforms: PreloadedQuery<EnsurePlatformsAreLoadedQuery> | null | undefined
  platform: PreloadedQuery<PlatformViewQuery> | null | undefined

  businessEntities: PreloadedQuery<BusinessEntitiesQuery> | null | undefined
  businessEntity: PreloadedQuery<BusinessEntityViewQuery> | null | undefined

  genres: PreloadedQuery<GenresQuery> | null | undefined
  genre: PreloadedQuery<GenreViewQuery> | null | undefined
}

interface LoadCtx {
  games(): void
  game(gameId: string): void
  platforms(): void
  platform(platformId: string): void
  businessEntities(): void
  businessEntity(businessEntityId: string): void
  genres(): void
  genre(genreId: string): void
}

const dataContext = React.createContext<DataCtx>(null as any)
const loaderContext = React.createContext<LoadCtx>(null as any)

export default function AppData({ children }: Props) {
  const [games, loadGames] = useQueryLoader<GamesQuery>(GamesQueryImpl)
  const [game, loadGame] = useQueryLoader<GameViewQuery>(GameViewQueryImpl)

  const [platforms, loadPlatforms] = useQueryLoader<EnsurePlatformsAreLoadedQuery>(EnsurePlatformsAreLoadedQueryImpl)
  const [platform, loadPlatform] = useQueryLoader<PlatformViewQuery>(PlatformViewQueryImpl)

  const [businessEntities, loadBusinessEntities] = useQueryLoader<BusinessEntitiesQuery>(BusinessEntitiesQueryImpl)
  const [businessEntity, loadBusinessEntity] = useQueryLoader<BusinessEntityViewQuery>(BusinessEntityViewQueryImpl)

  const [genres, loadGenres] = useQueryLoader<GenresQuery>(GenresQueryImpl)
  const [genre, loadGenre] = useQueryLoader<GenreViewQuery>(GenreViewQueryImpl)

  const data = useMemo<DataCtx>(
    () => ({
      games,
      game,
      platforms,
      platform,
      businessEntities,
      businessEntity,
      genres,
      genre,
    }),
    [businessEntities, businessEntity, game, games, genre, genres, platform, platforms]
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
      genres() {
        loadGenres({})
      },
      genre(genreId: string) {
        loadGenre({ genreId })
      },
    }),
    [loadBusinessEntities, loadBusinessEntity, loadGame, loadGames, loadGenre, loadGenres, loadPlatform, loadPlatforms]
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
