import { Router as ReachRouter } from '@reach/router'
import React, { ReactNode } from 'react'
import CreateNewGame from './pages/games/CreateNewGame'
import Games from './pages/games/Games'
import Home from './pages/home/Home'

interface DestinationProps {
  path: string
  jsx: ReactNode
}
function ReachDestination({ jsx }: DestinationProps) {
  return <>{jsx}</>
}

export default function Router() {
  return (
    <ReachRouter>
      <ReachDestination path="/" jsx={<Home />}></ReachDestination>
      <ReachDestination path="/games" jsx={<Games />}></ReachDestination>
      <ReachDestination path="/games/-/create" jsx={<CreateNewGame />}></ReachDestination>
    </ReachRouter>
  )
}
