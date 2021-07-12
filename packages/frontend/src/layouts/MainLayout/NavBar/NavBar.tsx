import React from 'react'
import styled from 'styled-components'
import AppTitle from './AppTitle'
import NavBarLink from './NavBarLink'

const Nav = styled.nav`
  background: orange;
  display: flex;
`

const Spacer = styled.div`
  flex-grow: 1;
`

export default function NavBar() {
  return (
    <Nav>
      <NavBarLink to="/">Home</NavBarLink>
      <NavBarLink to="/games">Games</NavBarLink>
      <NavBarLink to="/platforms">Platforms</NavBarLink>
      <NavBarLink to="/businessEntities">Business entities</NavBarLink>
      
      <Spacer />
      <AppTitle />
    </Nav>
  )
}
