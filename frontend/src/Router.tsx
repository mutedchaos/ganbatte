import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
import AddManyGames from './pages/misc/AddManyGames'
import MiscPage from './pages/misc/MiscPage'
import CreateNewPlatform from './pages/platforms/CreateNewPlatform'
import Platforms from './pages/platforms/Platforms'
import PlatformView from './pages/platforms/PlatformView/PlatformView'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/me" element={<Me />} />
        <Route path="/misc" element={<MiscPage />} />
        <Route path="/misc/addManyGames" element={<AddManyGames />} />

        <Route path="/games" element={<Games />} />
        <Route path="/games/-/create" element={<CreateNewGame />} />
        <Route path="/games/:gameId" element={<GameView />} />

        <Route path="/platforms" element={<Platforms />} />
        <Route path="/platforms/-/create" element={<CreateNewPlatform />} />
        <Route path="/platforms/:platformId" element={<PlatformView />} />

        <Route path="/businessEntities" element={<BusinessEntities />} />
        <Route path="/businessEntities/-/create" element={<CreateNewBusinessEntity />} />
        <Route path="/businessEntities/:businessEntityId" element={<BusinessEntityView />} />

        <Route path="/genres" element={<Genres />} />
        <Route path="/genres/-/create" element={<CreateNewGenre />} />
        <Route path="/genres/:genreId" element={<GenreView />} />

        <Route path="/features" element={<Features />} />
        <Route path="/features/-/create" element={<CreateNewFeature />} />
        <Route path="/features/:featureId" element={<FeatureView />} />
      </Routes>
    </BrowserRouter>
  )
}
