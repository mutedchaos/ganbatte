import { Link } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CachedLoader from '../../common/EnsureLoaded'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export const featuresQuery = graphql`
  query FeaturesQuery {
    getFeatureTypes {
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

export default function Features() {
  return (
    <MainLayout heading="Features">
      <CachedLoader entity={'features'} query={featuresQuery}>
        <FeaturesImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function FeaturesImpl() {
  const data = useCachedData('features')

  return (
    <>
      <FloatRight>
        <CreateNewButton />
      </FloatRight>
      <h2>Features</h2>
      <ul>
        {data.getFeatureTypes?.map((featureType) => (
          <li key={featureType.id}>
            <Link to={`/features/${featureType.id}`}>{featureType.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
