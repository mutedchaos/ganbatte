import { graphql } from 'babel-plugin-relay/macro'
import React, { Suspense, useContext, useEffect } from 'react'
import { usePreloadedQuery } from 'react-relay'
import { useAppData, useAppLoaders } from '../../../AppData'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import { GameViewQuery } from './__generated__/GameViewQuery.graphql'

export default function GameView() {
  const gameId = useContext(routePropContext).gameId as string
  const { loadGame } = useAppLoaders()
  useEffect(() => {
    loadGame(gameId)
  }, [loadGame, gameId])
  const queryRef = useAppData().gameQueryRef

  return (
    <MainLayout heading="Games">
      <Suspense fallback={<LoadingIndicator />}>{queryRef ? <GameViewImpl /> : <LoadingIndicator />}</Suspense>
    </MainLayout>
  )
}

export function GameViewImpl() {
  const queryRef = useAppData().gameQueryRef
  const data = usePreloadedQuery<GameViewQuery>(
    graphql`
      query GameViewQuery($gameId: String!) {
        game(gameId: $gameId) {
          id
          name
        }
      }
    `,
    queryRef!
  )

  return <h2>{data.game.name}</h2>
}
