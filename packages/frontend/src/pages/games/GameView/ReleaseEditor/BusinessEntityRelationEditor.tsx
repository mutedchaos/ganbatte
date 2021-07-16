import { useCallback, useState } from 'react'

import { getVaguelyUniqueId } from '../../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import { ReleaseEditorQueryResponse } from './__generated__/ReleaseEditorQuery.graphql'
import SingleBusinessEntityRelationEditor from './SingleBusinessEntityRelationEditor'

type Relation = ReleaseEditorQueryResponse['getRelease']['businessEntities'][number]

interface Props {
  relations: ReadonlyArray<Relation>
}

export type Entry = Partial<Relation> & { id: string; isNew?: boolean }

type State = Entry[]

export default function BusinessEntityRelationEditor({ relations: initial }: Props) {
  const [relations, setRelations] = useState<State>([...initial])

  const handleAdd = useCallback(() => {
    setRelations((old) => [...old, { id: getVaguelyUniqueId(), isNew: true }])
  }, [])

  const deleteNew = useCallback((id: string) => {
    setRelations((old) => old.filter((x) => x.id !== id))
  }, [])

  return (
    <div>
      {relations.map((relation) => (
        <SingleBusinessEntityRelationEditor
          key={relation.id}
          initial={relation}
          onDelete={relation.isNew ? deleteNew : undefined}
        />
      ))}
      <OrangeButton onClick={handleAdd}>Add new business entity</OrangeButton>
    </div>
  )
}
