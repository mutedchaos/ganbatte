import { useCallback, useState } from 'react'

import { useCachedData } from '../../../../common/CachedDataProvider'
import { getVaguelyUniqueId } from '../../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import { GameViewQuery, GenreAssociationType } from '../__generated__/GameViewQuery.graphql'
import SingleGameGenreEditor from './SingleGameGenreEditor'

type StoredEntry = GameViewQuery['response']['game']['genres'][number]

export type Entry =
  | (StoredEntry & { isNew?: undefined })
  | {
      id: string
      isNew: true
      association: GenreAssociationType | null
      genre: {
        id: string | null
      }
    }

export default function GameGenreEditor() {
  const { game } = useCachedData('game')
  const [newEntries, setNewEntries] = useState<Entry[]>([])

  const handleDelete = useCallback((id: string) => setNewEntries((old) => old.filter((x) => x.id !== id)), [])

  const createNew = useCallback(() => {
    setNewEntries((old) => [
      ...old,
      {
        id: getVaguelyUniqueId(),
        isNew: true,
        association: null,
        genre: {
          id: null,
        },
      },
    ])
  }, [])

  return (
    <div>
      {[...game.genres, ...newEntries]
        .filter((x) => x)
        .map((entry) => (
          <SingleGameGenreEditor key={entry.id} entry={entry} onDelete={handleDelete} gameId={game.id} />
        ))}
      <OrangeButton onClick={createNew}>Add new genre</OrangeButton>
    </div>
  )
}
