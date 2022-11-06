import { useCallback, useMemo } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'
import styled from 'styled-components'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import required from '../../../../common/required'
import DropdownInput, { Option } from '../../../../components/form/DropdownInput'
import Labeled from '../../../../components/form/Labeled'
import AutocompleteInput from '../../../../components/form/specific/AutocompleteInput'
import TextInput from '../../../../components/form/TextInput'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { ReleaseEntityRole } from './__generated__/ReleaseEditorQuery.graphql'
import { SingleBusinessEntityRelationEditorCreateMutation } from './__generated__/SingleBusinessEntityRelationEditorCreateMutation.graphql'
import { SingleBusinessEntityRelationEditorUpdateMutation } from './__generated__/SingleBusinessEntityRelationEditorUpdateMutation.graphql'
import type { Entry } from './BusinessEntityRelationEditor'

interface Props {
  releaseId: string
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

export default function SingleBusinessEntityRelationEditor({ initial, onDelete, releaseId }: Props) {
  const pristine = useMemo<State>(
    () => ({
      role: initial.role ?? null,
      businessEntity: initial.businessEntity?.name ?? null,
      roleDescription: initial.roleDescription ?? '',
    }),
    [initial.businessEntity?.name, initial.role, initial.roleDescription]
  )

  const [mutateCreate] = useMutation<SingleBusinessEntityRelationEditorCreateMutation>(graphql`
    mutation SingleBusinessEntityRelationEditorCreateMutation($releaseId: String!, $data: BusinessEntityRelationData!) {
      createBusinessEntityRelation(releaseId: $releaseId, data: $data) {
        id
        businessEntities {
          id
          roleDescription
          role
          businessEntity {
            id
            name
          }
        }
      }
    }
  `)

  const [mutateUpdate] = useMutation<SingleBusinessEntityRelationEditorUpdateMutation>(graphql`
    mutation SingleBusinessEntityRelationEditorUpdateMutation($id: String!, $data: BusinessEntityRelationData!) {
      updateBusinessEntityRelation(id: $id, data: $data) {
        id
        roleDescription
        role
        businessEntity {
          id
          name
        }
      }
    }
  `)

  const handleSimpleDelete = useCallback(() => {
    if (!onDelete) {
      throw new Error('Internal error')
    }
    onDelete(initial.id)
  }, [initial.id, onDelete])

  const handleSave = useCallback(
    async (state: State) => {
      if (initial.isNew) {
        mutateCreate({
          variables: {
            releaseId,
            data: {
              ...state,
              role: required(state.role),
              businessEntity: state.businessEntity ?? '',
            },
          },
          onCompleted() {
            handleSimpleDelete()
          },
        })
      } else {
        mutateUpdate({
          variables: {
            id: initial.id,
            data: {
              ...state,
              role: required(state.role),
              businessEntity: state.businessEntity ?? '',
            },
          },
        })
      }
    },
    [handleSimpleDelete, initial.id, initial.isNew, mutateCreate, mutateUpdate, releaseId]
  )

  const { state, updateState } = useEditing(pristine, handleSave)

  return (
    <Flex>
      <Labeled label="Role" required>
        <DropdownInput<'role', ReleaseEntityRole | null>
          required
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
