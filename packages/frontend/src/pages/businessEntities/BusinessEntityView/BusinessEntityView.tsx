import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'
import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/CachedLoader'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'

export default function BusinessEntityView() {
  const businessEntityId = useContext(routePropContext).businessEntityId as string

  const query = graphql`
    query BusinessEntityViewQuery($businessEntityId: String!) {
      businessEntity(businessEntityId: $businessEntityId) {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Business Entity">
      <CachedLoader entity="businessEntity" id={businessEntityId} query={query}>
        <BusinessEntityViewImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function BusinessEntityViewImpl() {
  const data = useCachedData('businessEntity')
  return <h2>{data.businessEntity.name}</h2>
}
