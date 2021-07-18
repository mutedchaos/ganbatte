import styled from 'styled-components'

import { Flex } from '../../../../components/styles/Flex'
import type { Tree } from './GameTree'

interface Props {
  tree: Tree
  node: Tree['games'][number]
}

const GameNode = styled.div`
  padding: 20px;
  border: 1px outset gray;
`

const Child = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const SequelType = styled.div`
  color: gray;
  align-self: center;
`

export default function SimpleTree({ tree, node }: Props) {
  return (
    <>
      <GameNode>{node.name}</GameNode>
      <Flex>
        {tree.sequels
          .filter((sequel) => sequel.predecessor.id === node.id)
          .map((sequel) => (
            <Child key={sequel.id}>
              <SequelType>- {sequel.sequelType} -</SequelType>
              <SimpleTree tree={tree} node={tree.games.find((game) => game.id === sequel.successor.id)!} />
            </Child>
          ))}
      </Flex>
    </>
  )
}
