import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/EnsureLoaded'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'

export default function GenreView() {
  const genreId = useContext(routePropContext).genreId as string

  const query = graphql`
    query GenreViewQuery($genreId: String!) {
      getGenre(genreId: $genreId) {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Genres">
      <CachedLoader entity="genre" id={genreId} query={query}>
        <GenreViewQueryImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function GenreViewQueryImpl() {
  const data = useCachedData('genre')
  return <h2>{data.getGenre.name}</h2>
}
