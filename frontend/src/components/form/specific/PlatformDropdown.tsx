import React, { useMemo } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import EnsurePlatformsAreLoaded from '../../loaders/EnsurePlatformsAreLoaded'
import DropdownInput from '../DropdownInput'

interface PropsNull<TField extends string> {
  value: string | null
  field: TField

  onUpdate(update: { [key in TField]: string | null }): void
  allowNull: true
}
interface PropsNoNull<TField extends string> {
  value: string
  field: TField

  onUpdate(update: { [key in TField]: string }): void
  allowNull?: false
}

type Props<TField extends string> = PropsNull<TField> | PropsNoNull<TField>

export default function PlatformDropdown<TField extends string>(props: Props<TField>) {
  return (
    <EnsurePlatformsAreLoaded>
      <PlatformDropdownImpl {...props} />
    </EnsurePlatformsAreLoaded>
  )
}

export function PlatformDropdownImpl<TField extends string>({ allowNull, ...props }: Props<TField>) {
  const data = useCachedData('platforms')

  const platformOptions = useMemo(() => {
    return data.listPlatforms.map((platform) => ({ value: platform.id, label: platform.name }))
  }, [data.listPlatforms])

  const options = useMemo(
    () => (allowNull ? [{ value: null, label: 'No selection' }, ...platformOptions] : platformOptions),
    [allowNull, platformOptions]
  )

  return <DropdownInput {...props} options={options} />
}
