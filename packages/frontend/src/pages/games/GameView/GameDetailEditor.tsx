import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'

import { useCachedData } from '../../../common/CachedDataProvider'
import mutateAsPromise from '../../../common/mutateAsPromise'
import Labeled from '../../../components/form/Labeled'
import TextInput from '../../../components/form/TextInput'
import { useEditing } from '../../../contexts/ActiveEditingContext'
import { GameDetailEditorMutation } from './__generated__/GameDetailEditorMutation.graphql'

export default function GameDetailEditor() {
  const [mutate] = useMutation<GameDetailEditorMutation>(graphql`
    mutation GameDetailEditorMutation($id: String!, $data: GameUpdate!) {
      updateGame(id: $id, data: $data) {
        id
        name
      }
    }
  `)

  const cachedGame = useCachedData('game')
  const pristineState = useMemo(
    () => ({
      name: cachedGame.game.name,
    }),
    [cachedGame.game.name]
  )

  const handleSave = useCallback(
    (state: typeof pristineState) => {
      return mutateAsPromise(mutate, {
        variables: {
          id: cachedGame.game.id,
          data: state,
        },
      })
    },
    [cachedGame.game.id, mutate]
  )

  const { state, updateState } = useEditing(pristineState, handleSave)

  return (
    <>
      <h1>{cachedGame.game.name}</h1>
      <Labeled label="Name">
        <TextInput value={state.name} field={'name'} onUpdate={updateState} />
      </Labeled>
      <div>{JSON.stringify(state)}</div>
    </>
  )
}
