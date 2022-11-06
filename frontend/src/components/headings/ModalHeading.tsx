import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const Heading = styled.h2`
  margin: 0;
  padding: 5px 5px;
  font-family: Roboto, sans-serif;
`

export default function ModalHeading({ children }: Props) {
  return <Heading>{children}</Heading>
}
