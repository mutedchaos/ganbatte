import { Link } from '@reach/router'
import React from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CreateNewButton from '../../components/buttons/CreateNewButton'
import EnsurePlatformsAreLoaded from '../../components/loaders/EnsurePlatformsAreLoaded'
import FloatRight from '../../components/styles/FloatRight'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function Platforms() {
  return (
    <MainLayout heading="Platforms">
      <EnsurePlatformsAreLoaded>
        <PlatformsImpl />
      </EnsurePlatformsAreLoaded>
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
