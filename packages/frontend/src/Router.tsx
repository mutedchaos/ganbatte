import { Router as ReachRouter } from '@reach/router'
import React, { ReactNode } from 'react'

import { routePropContext } from './contexts/RoutePropContext'
import BusinessEntities from './pages/businessEntities/BusinessEntities'
import BusinessEntityView from './pages/businessEntities/BusinessEntityView/BusinessEntityView'
import CreateNewBusinessEntity from './pages/businessEntities/CreateNewBusinessEntity'
import CreateNewFeature from './pages/features/CreateNewFeature'
import Features from './pages/features/Features'
import FeatureView from './pages/features/FeatureView/FeatureView'
import CreateNewGame from './pages/games/CreateNewGame'
import Games from './pages/games/Games'
import GameView from './pages/games/GameView/GameView'
import CreateNewGenre from './pages/genres/CreateNewGenre'
import Genres from './pages/genres/Genres'
import GenreView from './pages/genres/GenreView/GenreView'
import Home from './pages/home/Home'
import Me from './pages/me/Me'
import CreateNewPlatform from './pages/platforms/CreateNewPlatform'
import Platforms from './pages/platforms/Platforms'
import PlatformView from './pages/platforms/PlatformView/PlatformView'

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
      <ReachDestination path="/me" jsx={<Me />} />

      <ReachDestination path="/games" jsx={<Games />} />
      <ReachDestination path="/games/-/create" jsx={<CreateNewGame />} />
      <ReachDestination path="/games/:gameId" jsx={<GameView />} />

      <ReachDestination path="/platforms" jsx={<Platforms />} />
      <ReachDestination path="/platforms/-/create" jsx={<CreateNewPlatform />} />
      <ReachDestination path="/platforms/:platformId" jsx={<PlatformView />} />

      <ReachDestination path="/businessEntities" jsx={<BusinessEntities />} />
      <ReachDestination path="/businessEntities/-/create" jsx={<CreateNewBusinessEntity />} />
      <ReachDestination path="/businessEntities/:businessEntityId" jsx={<BusinessEntityView />} />

      <ReachDestination path="/genres" jsx={<Genres />} />
      <ReachDestination path="/genres/-/create" jsx={<CreateNewGenre />} />
      <ReachDestination path="/genres/:genreId" jsx={<GenreView />} />

      <ReachDestination path="/features" jsx={<Features />} />
      <ReachDestination path="/features/-/create" jsx={<CreateNewFeature />} />
      <ReachDestination path="/features/:featureId" jsx={<FeatureView />} />
    </ReachRouter>
  )
}
