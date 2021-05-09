import { Link, useMatch } from '@reach/router'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
  to: string
  children: ReactNode
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`

const BaseStyle = styled.div`
  background: orange;
  color: black;
  padding: 10px 20px;
  transition: background 250ms linear;
  &:hover {
    background: yellow;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const Separator = styled.div`
  height: 20px;
  width: 1px;
  background: red;
`

const DefaultStyle = styled(BaseStyle)``

const ActiveStyle = styled(BaseStyle)`
  background: gold;
`

const PrefixStyle = styled(BaseStyle)`
  background: darkorange;
`

const Hide = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  background: orange;
  margin-left: -1px;
`

const HideLeft = Hide

export default function NavBarLink({ to, children }: Props) {
  const match = useMatch(to)

  return (
    <Container>
      {match && <HideLeft />}
      <StyledLink to={to} key="link">
        {!match ? (
          <DefaultStyle>{children}</DefaultStyle>
        ) : match.path === to ? (
          <ActiveStyle>{children}</ActiveStyle>
        ) : (
          <PrefixStyle>{children}</PrefixStyle>
        )}
      </StyledLink>
      <Separator style={{ visibility: match ? 'hidden' : 'visible' }} />
    </Container>
  )
}
