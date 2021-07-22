import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/EnsureLoaded'
import Editable from '../../../components/misc/Editable'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import GenreEditor from './Edit/GenreEditor'

export default function GenreView() {
  const genreId = useContext(routePropContext).genreId as string

  const query = graphql`
    query GenreViewQuery($genreId: String!) {
      getGenre(genreId: $genreId) {
        id
        name
        parents {
          id
          association
          parent {
            name
          }
        }
        subgenres {
          id
          association
          child {
            name
          }
        }
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
  const { parents, subgenres } = data.getGenre
  return (
    <>
      <Editable editor={<GenreEditor />}>
        <h2>{data.getGenre.name}</h2>
      </Editable>
      <h3>Contained within</h3>
      {!parents.length && <p>None</p>}
      {!!parents.length && (
        <ul>
          {parents.map((parent) => (
            <li key={parent.id}>
              {parent.parent.name} ({parent.association})
            </li>
          ))}
        </ul>
      )}
      <h3>Implies</h3>
      {!subgenres.length && <p>None</p>}
      {!!subgenres.length && (
        <ul>
          {subgenres.map((child) => (
            <li key={child.id}>
              {child.child.name} ({child.association})
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
