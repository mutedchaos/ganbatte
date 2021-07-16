import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import DropdownInput, { Option } from '../../../../components/form/DropdownInput'
import Labeled from '../../../../components/form/Labeled'
import AutocompleteInput from '../../../../components/form/specific/AutocompleteInput'
import TextInput from '../../../../components/form/TextInput'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { ReleaseEntityRole } from './__generated__/ReleaseEditorQuery.graphql'
import type { Entry } from './BusinessEntityRelationEditor'

interface Props {
  initial: Entry
  onDelete?(id: string): void
}
const Flex = styled.div`
  display: flex;
`

interface State {
  role: ReleaseEntityRole | null
  businessEntity: string | null
  roleDescription: string
}

const roleOptions: Array<Option<State['role']>> = [
  { value: null, label: 'No selection' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Publisher', label: 'Publisher' },
]

export default function SingleBusinessEntityRelationEditor({ initial, onDelete }: Props) {
  const pristine = useMemo<State>(
    () => ({
      role: initial.role ?? null,
      businessEntity: initial.businessEntity?.name ?? null,
      roleDescription: initial.roleDescription ?? '',
    }),
    [initial.businessEntity?.name, initial.role, initial.roleDescription]
  )
  const handleSave = useCallback(async () => {}, [])

  const { state, updateState } = useEditing(pristine, handleSave)

  const handleSimpleDelete = useCallback(() => {
    if (!onDelete) {
      throw new Error('Internal error')
    }
    onDelete(initial.id)
  }, [initial.id, onDelete])

  return (
    <Flex>
      <Labeled label="Role">
        <DropdownInput<'role', ReleaseEntityRole | null>
          options={roleOptions}
          value={state.role}
          field={'role'}
          onUpdate={updateState}
        />
      </Labeled>
      <Labeled label="Entity" required>
        <AutocompleteInput
          required
          type="businessEntity"
          field="businessEntity"
          value={state.businessEntity}
          onUpdate={updateState}
        />
      </Labeled>
      <Labeled label="Additional information">
        <TextInput field="roleDescription" value={state.roleDescription} onUpdate={updateState} />
      </Labeled>
      {!initial.isNew ? (
        <DeleteEntityButton
          id={initial.id}
          entityName={state.role + ' ' + state.businessEntity}
          type="releaseRelatedBusinessEntity"
          typeLabel="Business entity relation"
        />
      ) : (
        <DeleteEntityButtonVisual onClick={handleSimpleDelete} />
      )}
    </Flex>
  )
}
