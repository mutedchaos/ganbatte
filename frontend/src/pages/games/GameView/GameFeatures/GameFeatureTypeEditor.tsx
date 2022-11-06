import { compact } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../../common/mutateAsPromise'
import FeatureDropdowns from '../../../../components/form/specific/FeatureDropdowns'
import { Flex } from '../../../../components/styles/Flex'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { FeaturesQueryResponse } from '../../../features/__generated__/FeaturesQuery.graphql'
import { GameFeatureTypeEditorMutation } from './__generated__/GameFeatureTypeEditorMutation.graphql'
import type { Entry } from './EditGameFeatures'

interface Props {
  gameId: string
  featureType: FeaturesQueryResponse['getFeatureTypes'][number]
  entry: Entry
  onDelete(typeId: string): void
}

interface Props {}
interface State {
  features: Array<string | null>
}

export default function GameFeatureTypeEditor({ entry, featureType, onDelete, gameId }: Props) {
  const [mutate] = useMutation<GameFeatureTypeEditorMutation>(graphql`
    mutation GameFeatureTypeEditorMutation($gameId: String!, $featureTypeId: String!, $featureIds: [String!]!) {
      updateFeatureSet(gameId: $gameId, featureTypeId: $featureTypeId, featureIds: $featureIds) {
        id
        featuresByType {
          type {
            id
            name
            editorStyle
          }
          features {
            id
            name
          }
        }
      }
    }
  `)

  const [deleteNotification, setDeleteNotification] = useState(false)
  const pristineState = useMemo<State>(
    () => ({
      features: entry.features.map((f) => f.id),
    }),
    [entry.features]
  )

  const handleSave = useCallback(
    async (state: State) => {
      await mutateAsPromise(mutate, {
        variables: { gameId, featureIds: compact(state.features), featureTypeId: featureType.id },
      })
    },
    [featureType.id, gameId, mutate]
  )

  const handleDelete = useCallback(() => {
    onDelete(entry.type.id)
  }, [entry.type.id, onDelete])

  const { state, updateState } = useEditing(pristineState, handleSave)

  const handleDeleteExisting = useCallback(() => {
    updateState({ features: [] })
    setDeleteNotification(true)
  }, [updateState])

  return (
    <>
      <Flex>
        <h3>{entry.type.name}</h3>
        {deleteNotification && !state.features.filter((x) => x).length && (
          <p>This will be deleted upon save as long as nothing is selected.</p>
        )}
        {entry.isNew && <DeleteEntityButtonVisual onClick={handleDelete} />}
        {!entry.isNew && (
          <DeleteEntityButton
            type="custom"
            typeLabel={'Features'}
            entityName={entry.type.name}
            onDelete={handleDeleteExisting}
          />
        )}
      </Flex>
      {entry.type.editorStyle === 'Dropdown' && (
        <FeatureDropdowns featureType={featureType} field="features" value={state.features} onUpdate={updateState} />
      )}
      {entry.type.editorStyle === 'Checkboxes' && (
        <FeatureDropdowns featureType={featureType} field="features" value={state.features} onUpdate={updateState} />
      )}
    </>
  )
}
