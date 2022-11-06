import { graphql } from 'react-relay'
import { useParams } from 'react-router-dom'

import { useCachedData } from '../../../common/CachedDataProvider'
import { default as CachedLoader } from '../../../common/EnsureLoaded'
import MainLayout from '../../../layouts/MainLayout/MainLayout'

export default function PlatformView() {
  const { platformId } = useParams()

  const query = graphql`
    query PlatformViewQuery($platformId: String!) {
      platform(platformId: $platformId) {
        id
        name
      }
    }
  `

  return (
    <MainLayout heading="Platforms">
      <CachedLoader entity="platform" id={platformId} query={query}>
        <PlatformViewImpl />
      </CachedLoader>
    </MainLayout>
  )
}

export function PlatformViewImpl() {
  const data = useCachedData('platform')
  return <h2>{data.platform.name}</h2>
}
