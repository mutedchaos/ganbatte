import { graphql } from 'react-relay'
import { useLazyLoadQuery } from 'react-relay'

import { useCachedData } from '../../../../common/CachedDataProvider'
import { GameTreeEditorQuery } from './__generated__/GameTreeEditorQuery.graphql'
import SequelEditor from './SequelEditor'

export default function GameTreeEditor() {
  const gameId = useCachedData('game').game.id
  const { game } = useLazyLoadQuery<GameTreeEditorQuery>(
    graphql`
      query GameTreeEditorQuery($gameId: String!) {
        game(gameId: $gameId) {
          id
          sequels {
            id
            sequelType
            predecessor {
              id
            }
            successor {
              id
            }
          }
          sequelOf {
            id
            sequelType
            predecessor {
              id
            }
            successor {
              id
            }
          }
        }
      }
    `,
    { gameId }
  )
  return (
    <div>
      <h2>Sequel Of</h2>
      <SequelEditor gameId={gameId} existing={game.sequelOf} fixed={'successor'} />
      <h2>Sequels</h2>
      <SequelEditor gameId={gameId} existing={game.sequels} fixed={'predecessor'} />
    </div>
  )
}
