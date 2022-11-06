import { graphql, useLazyLoadQuery } from 'react-relay'
import { useParams } from 'react-router-dom'

import { useCachedData, useDataCache } from '../../../common/CachedDataProvider'
import DebugView from '../../../components/DebugView'
import LoadingIndicator from '../../../components/LoadingIndicator'
import Editable from '../../../components/misc/Editable'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import { GameViewQuery } from './__generated__/GameViewQuery.graphql'
import GameDetailEditor from './GameDetailEditor'
import GameFeatures from './GameFeatures/GameFeatures'
import GameRating from './GameRating/GameRating'
import { GameReleases } from './GameReleases'
import GameTree from './GameTree/GameTree'
import GameGenres from './Genres/GameGenres'

export default function GameView() {
  const { gameId } = useParams()
  if (!gameId) throw new Error('gameId is required')
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
          featuresByType {
            type {
              id
              name
              editorStyle
            }
            features {
              id
              name
            }
          }
          myRating {
            expected {
              id
              score
            }
            actual {
              id
              score
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
      <GameFeatures />
      <GameRating />
    </div>
  )
}
