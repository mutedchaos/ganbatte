import { Link } from 'react-router-dom'
import React from 'react'
import { graphql } from 'react-relay'

import { useCachedData } from '../../common/CachedDataProvider'
import CachedLoader from '../../common/EnsureLoaded'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function Games() {
  const query = graphql`
    query GamesQuery {
      listGames {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Games">
      <CachedLoader entity={'games'} query={query}>
        <GamesImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function GamesImpl() {
  const data = useCachedData('games')

  return (
    <>
      <FloatRight>
        <CreateNewButton />
      </FloatRight>
      <h2>List of all games</h2>
      <ul>
        {data.listGames.map((game) => (
          <li key={game.id}>
            <Link to={`/games/${game.id}`}>{game.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
