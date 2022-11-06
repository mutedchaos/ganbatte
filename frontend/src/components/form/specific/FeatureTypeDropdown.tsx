import React, { useMemo } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import EnsureFeaturesAreLoaded from '../../loaders/EnsureFeaturesAreLoaded'
import DropdownInput from '../DropdownInput'

interface Props<TField extends string> {
  value: string | null
  field: TField
  excludedIds?: string[]
  required?: boolean

  onUpdate(update: { [key in TField]: string | null }): void
}

export default function FeatureTypeDropdown<TField extends string>(props: Props<TField>) {
  return (
    <EnsureFeaturesAreLoaded>
      <FeatureTypeDropdownImpl {...props} />
    </EnsureFeaturesAreLoaded>
  )
}

export function FeatureTypeDropdownImpl<TField extends string>({ excludedIds, ...props }: Props<TField>) {
  const { getFeatureTypes: featureTypes } = useCachedData('features')

  const options = useMemo(() => {
    return [
      { value: null, label: 'No selection' },
      ...featureTypes
        .filter((featureType) => !excludedIds?.includes(featureType.id))
        .map((featureType) => ({ value: featureType.id, label: featureType.name })),
    ]
  }, [excludedIds, featureTypes])

  return <DropdownInput {...props} options={options} />
}
