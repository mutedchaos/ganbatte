import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { headings } from '../../components/headings'
import { Modals } from '../../contexts/modal'
import NavBar from './NavBar/NavBar'

interface Props {
  heading: string
  children: ReactNode
}

const Body = styled.div`
  padding: 20px;
  max-width: 1200px;
`

export default function MainLayout({ children, heading }: Props) {
  return (
    <div>
      <NavBar />
      <headings.Page>{heading}</headings.Page>
      <Body>
        <Modals>
          <div>{children}</div>
        </Modals>
      </Body>
    </div>
  )
}
