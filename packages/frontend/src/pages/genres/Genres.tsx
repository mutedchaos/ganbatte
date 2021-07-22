import { Link } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CachedLoader from '../../common/EnsureLoaded'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function Genres() {
  const query = graphql`
    query GenresQuery {
      getGenres {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Genres">
      <CachedLoader entity={'genres'} query={query}>
        <GenresImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function GenresImpl() {
  const data = useCachedData('genres')

  return (
    <>
      <FloatRight>
        <CreateNewButton />
      </FloatRight>
      <h2>Genres</h2>
      <ul>
        {data.getGenres?.map((genre) => (
          <li key={genre.id}>
            <Link to={`/genres/${genre.id}`}>{genre.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
