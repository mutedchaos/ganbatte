import { Router as ReachRouter } from '@reach/router'
import React, { ReactNode } from 'react'
import CreateNewGame from './pages/games/CreateNewGame'
import Games from './pages/games/Games'
import GameView from './pages/games/GameView/GameView'
import Home from './pages/home/Home'
import { routePropContext } from './contexts/RoutePropContext'

interface DestinationProps {
  path: string
  jsx: ReactNode
}
function ReachDestination({ jsx, ...otherProps }: DestinationProps) {
  return <routePropContext.Provider value={otherProps}>{jsx}</routePropContext.Provider>
}

export default function Router() {
  return (
    <ReachRouter>
      <ReachDestination path="/" jsx={<Home />} />
      <ReachDestination path="/games" jsx={<Games />} />
      <ReachDestination path="/games/-/create" jsx={<CreateNewGame />} />
      <ReachDestination path="/games/:gameId" jsx={<GameView />} />
    </ReachRouter>
  )
}
