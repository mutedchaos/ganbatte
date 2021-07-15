import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'

import { useCachedData } from '../../../common/CachedDataProvider'
import DeleteEntityButton from '../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../common/mutateAsPromise'
import trimStrings from '../../../common/trimStrings'
import Labeled from '../../../components/form/Labeled'
import TextInput from '../../../components/form/TextInput'
import { EditingOptions, useEditing } from '../../../contexts/ActiveEditingContext'
import { GameDetailEditorMutation } from './__generated__/GameDetailEditorMutation.graphql'

export default function GameDetailEditor() {
  const [mutate] = useMutation<GameDetailEditorMutation>(graphql`
    mutation GameDetailEditorMutation($id: String!, $data: GameUpdate!) {
      updateGame(id: $id, data: $data) {
        id
        name
        sortName
      }
    }
  `)

  const cachedGame = useCachedData('game')
  const pristineState = useMemo(
    () => ({
      name: cachedGame.game.name,
      sortName: cachedGame.game.sortName,
    }),
    [cachedGame.game.name, cachedGame.game.sortName]
  )

  const handleSave = useCallback(
    (state: typeof pristineState) => {
      return mutateAsPromise(mutate, {
        variables: {
          id: cachedGame.game.id,
          data: trimStrings(state),
        },
      })
    },
    [cachedGame.game.id, mutate]
  )

  const options = useMemo<EditingOptions<typeof pristineState>>(
    () => ({
      customReducer(state, mod) {
        if (mod.name && !mod.sortName && state.sortName === state.name.toLowerCase()) {
          return { ...state, ...mod, sortName: mod.name.toLowerCase() }
        } else {
          return { ...state, ...mod }
        }
      },
    }),
    []
  )

  const { state, updateState } = useEditing(pristineState, handleSave, options)

  return (
    <>
      <DeleteEntityButton
        type="game"
        id={cachedGame.game.id}
        typeLabel="Game"
        entityName={cachedGame.game.id}
        targetPage="/games"
      />
      <h1>{cachedGame.game.name}</h1>
      <Labeled label="Name">
        <TextInput value={state.name} field={'name'} onUpdate={updateState} />
      </Labeled>
      <Labeled label="Sort Name">
        <TextInput value={state.sortName} field={'sortName'} onUpdate={updateState} />
      </Labeled>
      <div>{JSON.stringify(state)}</div>
    </>
  )
}
