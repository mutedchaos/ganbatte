import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  label: ReactNode
  sublabel?: ReactNode
  children: ReactNode
}
const Container = styled.div`
  margin-top: 10px;
  border-bottom: 1px dotted lightgray;
  padding-bottom: 10px;
`
const Label = styled.div`
  margin-bottom: 5px;
`
const Body = styled.div`
  margin-left: 10px;
`
const Sublabel = styled.div`
  margin-top: -5px;
  margin-bottom: 5px;
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
