import { Link } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CachedLoader from '../../common/EnsureLoaded'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function Platforms() {
  const query = graphql`
    query PlatformsQuery {
      listPlatforms {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Platforms">
      <CachedLoader entity={'platforms'} query={query}>
        <PlatformsImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function PlatformsImpl() {
  const data = useCachedData('platforms')

  return (
    <>
      <FloatRight>
        <CreateNewButton />
      </FloatRight>
      <h2>List of all platforms</h2>
      <ul>
        {data.listPlatforms.map((platform) => (
          <li key={platform.id}>
            <Link to={`/platforms/${platform.id}`}>{platform.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
