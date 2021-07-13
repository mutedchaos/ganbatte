import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/CachedLoader'
import Editable from '../../../components/misc/Editable'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import GameDetailEditor from './GameDetailEditor'

export default function GameView() {
  const gameId = useContext(routePropContext).gameId as string

  const query = graphql`
    query GameViewQuery($gameId: String!) {
      game(gameId: $gameId) {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Games">
      <CachedLoader entity="game" id={gameId} query={query}>
        <GameViewImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function GameViewImpl() {
  const data = useCachedData('game')
  return (
    <Editable editor={<GameDetailEditor />}>
      <h2>{data.game.name}</h2>
    </Editable>
  )
}
