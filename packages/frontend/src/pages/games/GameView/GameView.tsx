import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'
import { useLazyLoadQuery } from 'react-relay'

import { useCachedData, useDataCache } from '../../../common/CachedDataProvider'
import DebugView from '../../../components/DebugView'
import LoadingIndicator from '../../../components/LoadingIndicator'
import Editable from '../../../components/misc/Editable'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import { GameViewQuery } from './__generated__/GameViewQuery.graphql'
import GameDetailEditor from './GameDetailEditor'
import GameGenres from './Genres/GameGenres'
import { GameReleases } from './GameReleases'
import GameTree from './GameTree/GameTree'

export default function GameView() {
  const gameId = useContext(routePropContext).gameId as string

  const data = useLazyLoadQuery<GameViewQuery>(
    graphql`
      query GameViewQuery($gameId: String!) {
        game(gameId: $gameId) {
          id
          name
          sortName
          releases {
            id
            specifier
            releaseDate
            platform {
              id
              name
            }
            ownership {
              id
              ownershipType
              isNew
            }
          }
          genres {
            id
            association
            genre {
              id
              name
            }
          }
          relatedGenres {
            id
            name
            subgenres {
              association
              child {
                id
              }
            }
          }
        }
      }
    `,
    { gameId }
  )

  useDataCache('game', data as any)
  const cached = useCachedData('game')

  return <MainLayout heading="Games">{cached !== data ? <LoadingIndicator /> : <GameViewImpl />}</MainLayout>
}

export function GameViewImpl() {
  const data = useCachedData('game')
  return (
    <div key={data.game.id}>
      <DebugView data={data} label="Game Data" />
      <Editable editor={<GameDetailEditor />}>
        <h2>{data.game.name}</h2>
      </Editable>
      <GameReleases />
      <GameTree gameId={data.game.id} />
      <GameGenres />
    </div>
  )
}
