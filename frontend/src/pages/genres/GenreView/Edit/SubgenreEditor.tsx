import { useCallback, useState } from 'react'

import { useCachedData } from '../../../../common/CachedDataProvider'
import { getVaguelyUniqueId } from '../../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import { GenreAssociationType, GenreViewQuery } from '../__generated__/GenreViewQuery.graphql'
import SingleSubgenreEditor from './SingleSubgenreEditor'

type StoredEntry = GenreViewQuery['response']['getGenre']['subgenres'][number]

export type Entry =
  | (StoredEntry & { isNew?: undefined })
  | {
      id: string
      isNew: true
      association: GenreAssociationType | null
      child: {
        id: string | null
      }
    }

export default function SubgenreEditor() {
  const genre = useCachedData('genre')
  const [newEntries, setNewEntries] = useState<Entry[]>([])

  const handleDelete = useCallback((id: string) => setNewEntries((old) => old.filter((x) => x.id !== id)), [])

  const createNew = useCallback(() => {
    setNewEntries((old) => [
      ...old,
      {
        id: getVaguelyUniqueId(),
        isNew: true,
        association: null,
        child: {
          id: null,
        },
      },
    ])
  }, [])

  return (
    <div>
      {[...genre.getGenre.subgenres, ...newEntries]
        .filter((x) => x)
        .map((entry) => (
          <SingleSubgenreEditor key={entry.id} entry={entry} onDelete={handleDelete} parentId={genre.getGenre.id} />
        ))}
      <OrangeButton onClick={createNew}>Create new subgenre</OrangeButton>
    </div>
  )
}
