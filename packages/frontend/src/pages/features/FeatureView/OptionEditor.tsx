import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../common/mutateAsPromise'
import Labeled from '../../../components/form/Labeled'
import TextInput from '../../../components/form/TextInput'
import { Flex } from '../../../components/styles/Flex'
import { useEditing } from '../../../contexts/ActiveEditingContext'
import { Validateable } from '../../../contexts/Validation'
import { OptionEditorCreateMutation } from './__generated__/OptionEditorCreateMutation.graphql'
import { OptionEditorUpdateMutation } from './__generated__/OptionEditorUpdateMutation.graphql'
import type { Entry } from './FeatureOptionEditor'

interface Props {
  featureTypeId: string
  entry: Entry
  onDelete(id: string): void
}

interface State {
  name: string
}

export default function OptionEditor({ entry, onDelete, featureTypeId }: Props) {
  const [createMutation] = useMutation<OptionEditorCreateMutation>(graphql`
    mutation OptionEditorCreateMutation($featureTypeId: String!, $name: String!) {
      createFeature(featureTypeId: $featureTypeId, name: $name) {
        id
        name
        type {
          id
          features {
            id
            name
          }
        }
      }
    }
  `)

  const [updateMutation] = useMutation<OptionEditorUpdateMutation>(graphql`
    mutation OptionEditorUpdateMutation($featureId: String!, $name: String!) {
      updateFeature(featureId: $featureId, name: $name) {
        id
        name
        type {
          id
          features {
            id
            name
          }
        }
      }
    }
  `)
  const pristineState = useMemo<State>(
    () => ({
      name: entry.name,
    }),
    [entry.name]
  )
  const handleDelete = useCallback(() => {
    onDelete(entry.id)
  }, [entry.id, onDelete])
  const handleSave = useCallback(
    async (state: State) => {
      if (entry.isNew) {
        await mutateAsPromise(createMutation, {
          variables: {
            featureTypeId,
            name: state.name,
          },
        })
        handleDelete()
      } else {
        await mutateAsPromise(updateMutation, {
          variables: {
            featureId: entry.id,
            name: state.name,
          },
        })
      }
    },
    [createMutation, entry.id, entry.isNew, featureTypeId, handleDelete, updateMutation]
  )

  const { state, updateState, validate } = useEditing(pristineState, handleSave)
  return (
    <Validateable onValidate={validate}>
      <Flex>
        <Labeled label="Name">
          <TextInput value={state.name} onUpdate={updateState} field="name" />
        </Labeled>

        {entry.isNew ? (
          <DeleteEntityButtonVisual onClick={handleDelete} />
        ) : (
          <DeleteEntityButton entityName={entry.name} type="feature" typeLabel="feature" id={entry.id} />
        )}
      </Flex>
    </Validateable>
  )
}
