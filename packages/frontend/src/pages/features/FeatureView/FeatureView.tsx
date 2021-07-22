import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/EnsureLoaded'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'

export default function FeatureView() {
  const featureId = useContext(routePropContext).featureId as string

  const query = graphql`
    query FeatureViewQuery($featureId: String!) {
      getFeatureType(featureId: $featureId) {
        id
        name
        editorStyle
        features {
          id
          name
        }
      }
    }
  `


  

  return (
    <MainLayout heading="Feature">
      <CachedLoader entity="feature" id={featureId} query={query}>
        <FeatureViewImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function FeatureViewImpl() {
  const data = useCachedData('feature')

  return <h1>{data.getFeatureType.name}</h1>
}
