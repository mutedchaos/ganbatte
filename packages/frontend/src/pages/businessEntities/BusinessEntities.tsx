import { Link } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CachedLoader from '../../common/EnsureLoaded'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function BusinessEntities() {
  const query = graphql`
    query BusinessEntitiesQuery {
      listBusinessEntities {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="BusinessEntities">
      <CachedLoader entity={'businessEntities'} query={query}>
        <BusinessEntitiesImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function BusinessEntitiesImpl() {
  const data = useCachedData('businessEntities')

  return (
    <>
      <FloatRight>
        <CreateNewButton />
      </FloatRight>
      <h2>List of all businessEntities</h2>
      <ul>
        {data.listBusinessEntities.map((businessEntity) => (
          <li key={businessEntity.id}>
            <Link to={`/businessEntities/${businessEntity.id}`}>{businessEntity.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
