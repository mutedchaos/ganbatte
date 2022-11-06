import { GameTreeQuery } from './__generated__/GameTreeQuery.graphql'

interface Props {
  tree: GameTreeQuery['response']['gameFranchise']
  node: GameTreeQuery['response']['gameFranchise']['games'][number]
  depth: number
}

export default function FranchiseNode({ tree, node, depth }: Props) {
  console.log(tree, node, depth)
  return null
}
