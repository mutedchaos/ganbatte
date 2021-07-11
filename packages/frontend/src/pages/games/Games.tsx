import React, { Suspense, useEffect } from 'react'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { graphql } from 'babel-plugin-relay/macro'
import { usePreloadedQuery } from 'react-relay'
import { useAppData, useAppLoaders } from '../../AppData'
import { GamesQuery } from './__generated__/GamesQuery.graphql'
import LoadingIndicator from '../../components/LoadingIndicator'
import FloatRight from '../../components/styles/FloatRight'
import { Link } from '@reach/router'

export default function Games() {
  const { loadGames } = useAppLoaders()
  useEffect(() => {
    loadGames()
  }, [loadGames])
  const queryRef = useAppData().gamesQueryRef

  return (
    <MainLayout heading="Games">
      <Suspense fallback={<LoadingIndicator />}>{queryRef ? <GamesImpl /> : <LoadingIndicator />}</Suspense>
    </MainLayout>
  )
}

export function GamesImpl() {
  const queryRef = useAppData().gamesQueryRef
  const data = usePreloadedQuery<GamesQuery>(
    graphql`
      query GamesQuery {
        listGames {
          id
          name
        }
      }
    `,
    queryRef!
  )

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
