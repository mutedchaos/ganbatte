import React, { useContext, useMemo } from 'react'
import { ReactNode } from 'react'
import { PreloadedQuery, useQueryLoader } from 'react-relay'
import { GamesQuery } from './pages/games/__generated__/GamesQuery.graphql'
import GamesQueryImpl from './pages/games/__generated__/GamesQuery.graphql'
import { GameViewQuery, default as GameViewQueryImpl } from './pages/games/GameView/__generated__/GameViewQuery.graphql'

interface Props {
  children: ReactNode
}

interface DataCtx {
  gamesQueryRef: PreloadedQuery<GamesQuery> | null | undefined
  gameQueryRef: PreloadedQuery<GameViewQuery> | null | undefined
}

interface LoadCtx {
  loadGames(): void
  loadGame(gameId: string): void
}

const dataContext = React.createContext<DataCtx>(null as any)
const loaderContext = React.createContext<LoadCtx>(null as any)

export default function AppData({ children }: Props) {
  const [gamesQueryRef, loadGames] = useQueryLoader<GamesQuery>(GamesQueryImpl)
  const [gameQueryRef, loadGame] = useQueryLoader<GameViewQuery>(GameViewQueryImpl)

  const data = useMemo<DataCtx>(
    () => ({
      gamesQueryRef,
      gameQueryRef,
    }),
    [gameQueryRef, gamesQueryRef]
  )

  const loaders = useMemo<LoadCtx>(
    () => ({
      loadGames() {
        loadGames({})
      },
      loadGame(gameId: string) {
        loadGame({ gameId })
      },
    }),
    [loadGame, loadGames]
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
