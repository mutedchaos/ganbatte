import { useCallback, useState } from 'react'

import { getVaguelyUniqueId } from '../../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import { DeepNullSimpleValues, IdRequired } from '../../../../my-types'
import { GameTreeEditorQuery } from './__generated__/GameTreeEditorQuery.graphql'
import SequelEdit from './SequelEdit'

interface Props {
  gameId: string
  fixed: 'successor' | 'predecessor'
  existing: GameTreeEditorQuery['response']['game']['sequelOf']
}

export type Entry = IdRequired<
  DeepNullSimpleValues<GameTreeEditorQuery['response']['game']['sequelOf'][number] & { isNew?: boolean }>
>

export default function SequelEditor({ gameId, existing, fixed }: Props) {
  const variable = fixed === 'successor' ? ('predecessor' as const) : ('successor' as const)
  const [newEntries, setNewEntries] = useState<Entry[]>([])

  const addNew = useCallback(() => {
    setNewEntries((old) => [
      ...old,
      {
        isNew: true,
        id: getVaguelyUniqueId(),
        successor: { id: null },
        predecessor: { id: null },
        sequelType: null,
        [fixed]: { id: gameId },
      },
    ])
  }, [fixed, gameId])

  const deleteNew = useCallback((id: string) => {
    setNewEntries((old) => old.filter((entry) => entry.id !== id))
  }, [])

  return (
    <div>
      {[...existing, ...newEntries]
        .filter((x) => x)
        .map((e) => (
          <SequelEdit key={e.id} entry={e} field={variable} otherGameId={gameId} onDelete={deleteNew} />
        ))}
      <OrangeButton onClick={addNew}>Add</OrangeButton>
    </div>
  )
}
