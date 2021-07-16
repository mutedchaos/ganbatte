import React, { useMemo } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import EnsurePlatformsAreLoaded from '../../loaders/EnsurePlatformsAreLoaded'
import DropdownInput from '../DropdownInput'

interface Props<TField extends string> {
  value: string
  field: TField

  onUpdate(update: { [key in TField]: string }): void
}

export default function PlatformDropdown<TField extends string>(props: Props<TField>) {
  return (
    <EnsurePlatformsAreLoaded>
      <PlatformDropdownImpl {...props} />
    </EnsurePlatformsAreLoaded>
  )
}

export function PlatformDropdownImpl<TField extends string>(props: Props<TField>) {
  const data = useCachedData('platforms')

  const options = useMemo(() => {
    return data.listPlatforms.map((platform) => ({ value: platform.id, label: platform.name, key: platform.id }))
  }, [data.listPlatforms])

  return <DropdownInput {...props} options={options} />
}
