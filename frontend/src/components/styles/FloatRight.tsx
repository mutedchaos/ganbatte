import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const Container = styled.div`
  float: right;
`

export default function FloatRight({ children }: Props) {
  return <Container>{children}</Container>
}
