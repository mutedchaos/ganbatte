import { useCallback, useState } from 'react'

import { getVaguelyUniqueId } from '../../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import { ReleaseEditorQuery } from './__generated__/ReleaseEditorQuery.graphql'
import SingleBusinessEntityRelationEditor from './SingleBusinessEntityRelationEditor'

type Relation = ReleaseEditorQuery['response']['getRelease']['businessEntities'][number]

interface Props {
  releaseId: string
  relations: ReadonlyArray<Relation>
}

export type Entry = Partial<Relation> & { id: string; isNew?: boolean }

type State = Entry[]

export default function BusinessEntityRelationEditor({ relations: initial, releaseId }: Props) {
  const [newRelations, setNewRelations] = useState<State>([])

  const handleAdd = useCallback(() => {
    setNewRelations((old) => [...old, { id: getVaguelyUniqueId(), isNew: true }])
  }, [])

  const deleteNew = useCallback((id: string) => {
    setNewRelations((old) => old.filter((x) => x.id !== id))
  }, [])

  return (
    <div>
      {[...initial, ...newRelations]
        .filter((x) => x)
        .map((relation) => (
          <SingleBusinessEntityRelationEditor
            releaseId={releaseId}
            key={relation.id}
            initial={relation}
            onDelete={'isNew' in relation && relation.isNew ? deleteNew : undefined}
          />
        ))}
      <OrangeButton onClick={handleAdd}>Add new business entity</OrangeButton>
    </div>
  )
}
