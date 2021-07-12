import { Router as ReachRouter } from '@reach/router'
import React, { ReactNode } from 'react'
import CreateNewGame from './pages/games/CreateNewGame'
import Games from './pages/games/Games'
import GameView from './pages/games/GameView/GameView'
import Home from './pages/home/Home'
import { routePropContext } from './contexts/RoutePropContext'
import CreateNewPlatform from './pages/platforms/CreateNewPlatform'
import PlatformView from './pages/platforms/PlatformView/PlatformView'
import BusinessEntities from './pages/businessEntities/BusinessEntities'
import CreateNewBusinessEntity from './pages/businessEntities/CreateNewBusinessEntity'
import BusinessEntityView from './pages/businessEntities/BusinessEntityView/BusinessEntityView'
import Platforms from './pages/platforms/Platforms'

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

      <ReachDestination path="/platforms" jsx={<Platforms />} />
      <ReachDestination path="/platforms/-/create" jsx={<CreateNewPlatform />} />
      <ReachDestination path="/platforms/:platformId" jsx={<PlatformView />} />

      <ReachDestination path="/businessEntities" jsx={<BusinessEntities />} />
      <ReachDestination path="/businessEntities/-/create" jsx={<CreateNewBusinessEntity />} />
      <ReachDestination path="/businessEntities/:gameId" jsx={<BusinessEntityView />} />
    </ReachRouter>
  )
}
