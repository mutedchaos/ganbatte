import React, { useMemo } from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import CheckboxArrayInput from '../../components/form/CheckboxArrayInput'
import EnsurePlatformsAreLoaded from '../../components/loaders/EnsurePlatformsAreLoaded'

interface Props<TField extends string> {
  value: string[]
  field: TField

  onUpdate(update: { [key in TField]: string[] }): void
}

export default function PlatformCheckboxes<TField extends string>(props: Props<TField>) {
  return (
    <EnsurePlatformsAreLoaded>
      <PlatformCheckboxesImpl {...props} />
    </EnsurePlatformsAreLoaded>
  )
}

export function PlatformCheckboxesImpl<TField extends string>(props: Props<TField>) {
  const data = useCachedData('platforms')

  const options = useMemo(() => {
    return data.listPlatforms.map((platform) => ({ value: platform.id, label: platform.name, key: platform.id }))
  }, [data.listPlatforms])

  return <CheckboxArrayInput {...props} options={options} />
}
