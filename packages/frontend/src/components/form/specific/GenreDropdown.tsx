import React, { useMemo } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import EnsureGenresAreLoaded from '../../loaders/EnsureGenresAreLoaded'
import DropdownInput from '../DropdownInput'

interface Props<TField extends string> {
  value: string | null
  field: TField
  required?: boolean

  onUpdate(update: { [key in TField]: string | null }): void
}

export default function GenreDropdown<TField extends string>(props: Props<TField>) {
  return (
    <EnsureGenresAreLoaded>
      <GenreDropdownImpl {...props} />
    </EnsureGenresAreLoaded>
  )
}

export function GenreDropdownImpl<TField extends string>(props: Props<TField>) {
  const data = useCachedData('genres')

  const options = useMemo(() => {
    return [
      { value: null, label: 'No selection' },
      ...data.getGenres.map((genre) => ({ value: genre.id, label: genre.name })),
    ]
  }, [data.getGenres])

  return <DropdownInput {...props} options={options} />
}
