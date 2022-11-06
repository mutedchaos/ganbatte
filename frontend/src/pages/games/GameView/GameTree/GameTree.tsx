import { useMemo, useState } from 'react'
import { graphql } from 'react-relay'
import { useLazyLoadQuery } from 'react-relay'

import TypedValueSelect, { StringLabeledOption } from '../../../../components/form/TypedValueSelect'
import TogglableEditable from '../../../../components/misc/TogglableEditable'
import { GameTreeQuery } from './__generated__/GameTreeQuery.graphql'
import GameTreeEditor from './GameTreeEditor'
import SimpleTree from './SimpleTree'
import TreeGraph from './TreeGraph'

export type Tree = GameTreeQuery['response']['gameFranchise']

const options: Array<StringLabeledOption<'simple' | 'graph'>> = [
  {
    label: 'Simple',
    value: 'simple',
  },
  {
    label: 'Graph',
    value: 'graph',
  },
]

interface Props {
  gameId: string
}

export default function GameTree({ gameId }: Props) {
  const [mode, setMode] = useState<'simple' | 'graph'>('simple')

  const { gameFranchise: tree } = useLazyLoadQuery<GameTreeQuery>(
    graphql`
      query GameTreeQuery($gameId: String!) {
        gameFranchise(gameId: $gameId) {
          games {
            id
            name
          }
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
        }
      }
    `,
    {
      gameId,
    }
  )

  const isSimpleTree = useMemo(() => calculateIsSimpleTree(tree), [tree])
  const roots = useMemo(() => findRoots(tree), [tree])

  const actualMode = mode === 'simple' && isSimpleTree ? mode : ('graph' as const)

  return (
    <div>
      <h2>Game Franchise</h2>
      <TogglableEditable editor={<GameTreeEditor />}>
        {isSimpleTree && <TypedValueSelect value={mode} options={options} onChange={setMode} />}
        {actualMode === 'simple' && <SimpleTree tree={tree} node={roots[0]} />}
        {actualMode === 'graph' && <TreeGraph tree={tree} />}
      </TogglableEditable>
    </div>
  )
}

function calculateIsSimpleTree(tree: Tree) {
  return tree.games.every((game) => tree.sequels.filter((s) => s.successor.id === game.id).length <= 1)
}

function findRoots(tree: Tree) {
  return tree.games.filter((game) => tree.sequels.every((sequel) => sequel.successor.id !== game.id))
}
