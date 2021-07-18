import { Graphviz } from 'graphviz-react'
import { useMemo } from 'react'

import type { Tree } from './GameTree'

interface Props {
  tree: Tree
}

export default function TreeGraph({ tree }: Props) {
  const dot = useMemo(
    () => `
digraph mygraph {
  node [shape=box];
  ${tree.games.map((game) => `  "${game.id}" [label="${game.name.replace(/"/g, "'")}"]`).join('\n')}
  ${tree.sequels.map((sequel) => `  "${sequel.predecessor.id}" -> "${sequel.successor.id}"`).join('\n')}
}
  `,
    [tree.games, tree.sequels]
  )
  return <Graphviz dot={dot} />
}
