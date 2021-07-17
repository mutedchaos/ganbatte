import TogglableEditable from '../../../../components/misc/TogglableEditable'
import GameTreeEditor from './GameTreeEditor'

export default function GameTree() {
  return (
    <div>
      <h2>Game Franchise</h2>
      <TogglableEditable editor={<GameTreeEditor />}>Not implemented</TogglableEditable>
    </div>
  )
}

