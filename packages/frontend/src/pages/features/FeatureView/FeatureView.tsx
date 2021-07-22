import { graphql } from 'babel-plugin-relay/macro'
import React, { useContext } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/EnsureLoaded'
import Editable from '../../../components/misc/Editable'
import ToggableEditable from '../../../components/misc/TogglableEditable'
import { routePropContext } from '../../../contexts/RoutePropContext'
import MainLayout from '../../../layouts/MainLayout/MainLayout'
import FeatureOptionEditor from './FeatureOptionEditor'
import FeatureTypeEditor from './FeatureTypeEditor'

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
  const { getFeatureType: featureType } = useCachedData('feature')

  return (
    <>
      <h1>{featureType.name}</h1>
      <Editable editor={<FeatureTypeEditor />}>
        <p>Suggested editor style: {featureType.editorStyle}</p>
      </Editable>
      <h2>Options</h2>
      <ToggableEditable editor={<FeatureOptionEditor />}>
        {!featureType.features.length && <p>None</p>}
        <ul>
          {featureType.features.map((feat) => (
            <li key={feat.id}>{feat.name}</li>
          ))}
        </ul>
      </ToggableEditable>
    </>
  )
}
