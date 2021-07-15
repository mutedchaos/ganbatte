import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { headings } from '../../components/headings'
import { Modals } from '../../contexts/modal'
import { PlaceholderNavBar } from './NavBar/NavBar'

interface Props {
  heading: string
  children: ReactNode
}

const Body = styled.div`
  padding: 20px;
`

export default function SimpleLayout({ children, heading }: Props) {
  return (
    <div>
      <PlaceholderNavBar />
      <headings.Page>{heading}</headings.Page>
      <Body>
        <Modals>
          <div>{children}</div>
        </Modals>
      </Body>
    </div>
  )
}
