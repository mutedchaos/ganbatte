import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  label: ReactNode
  sublabel?: ReactNode
  children: ReactNode
}
const Container = styled.div``
const Label = styled.div``
const Body = styled.div``
const Sublabel = styled.div`
  font-size: 0.8em;
`

export default function Labeled({ label, children, sublabel }: Props) {
  return (
    <Container>
      <Label>{label}</Label>
      {sublabel && <Sublabel>{sublabel}</Sublabel>}
      <Body>{children}</Body>
    </Container>
  )
}
