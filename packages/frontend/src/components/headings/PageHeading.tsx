import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  children: ReactNode
}

const Heading = styled.h1`
  background: gold;
  margin: 0;
  padding: 5px 30px;
  color: transparent;
  font-family: Roboto, sans-serif;
  font-size: 1px;
`

export default function PageHeading({ children }: Props) {
  return <Heading>{children}</Heading>
}
