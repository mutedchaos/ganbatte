import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  label: ReactNode
  children: ReactNode
}
const Container = styled.div``
const Label = styled.div``
const Body = styled.div``

export default function Labeled({ label, children }: Props) {
  return (
    <Container>
      <Label>{label}</Label>
      <Body>{children}</Body>
    </Container>
  )
}
