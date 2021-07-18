import { GameTreeQueryResponse } from './__generated__/GameTreeQuery.graphql'

interface Props {
  tree: GameTreeQueryResponse['gameFranchise']
  node: GameTreeQueryResponse['gameFranchise']['games'][number]
  depth: number
}

export default function FranchiseNode({ tree, node, depth }: Props) {}
