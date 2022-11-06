import { useCachedData } from '../../../../common/CachedDataProvider'
import ToggableEditable from '../../../../components/misc/TogglableEditable'
import EditRating from './EditRating'
import ScoreView from './ScoreView'

export default function GameRating() {
  const {
    game: {
      myRating: { actual, expected },
    },
  } = useCachedData('game')
  return (
    <ToggableEditable editor={<EditRating />}>
      <h2>Rating</h2>
      {actual ? (
        <ScoreView score={actual?.score} />
      ) : expected ? (
        <ScoreView score={expected?.score} faded />
      ) : (
        <p>Not rated.</p>
      )}
    </ToggableEditable>
  )
}
