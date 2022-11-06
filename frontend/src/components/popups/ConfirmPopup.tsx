import styled from 'styled-components'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'

const Container = styled.div`
  position: fixed;
  width: 600px;
  left: calc(50vw - 300px);
  top: max(100px, 25%);
  background: white;
  z-index: 1001;
  padding: 20px;
  border: 4px solid gold;
  box-shadow: 5px 5px 25px #88880050;
`

export default function ConfirmPopup({ children }: ChildrenOnlyProps) {
  return <Container>{children}</Container>
}
