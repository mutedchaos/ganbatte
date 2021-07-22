import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'

import { useCachedData } from '../../../../common/CachedDataProvider'
import mutateAsPromise from '../../../../common/mutateAsPromise'
import Labeled from '../../../../components/form/Labeled'
import TextInput from '../../../../components/form/TextInput'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { GenreEditorMutation } from './__generated__/GenreEditorMutation.graphql'

interface State {
  name: string
}

export default function GenreEditor() {
  const genre = useCachedData('genre')
  const [mutate] = useMutation<GenreEditorMutation>(graphql`
    mutation GenreEditorMutation($genreId: String!, $name: String!) {
      updateGenre(genreId: $genreId, name: $name) {
        id
        name
      }
    }
  `)
  const pristineState = useMemo<State>(() => ({ name: genre.getGenre.name }), [genre.getGenre.name])
  const handleSave = useCallback(
    async (state: State) => {
      return mutateAsPromise(mutate, { variables: { genreId: genre.getGenre.id, name: state.name } })
    },
    [genre.getGenre.id, mutate]
  )
  const { state, updateState } = useEditing(pristineState, handleSave)
  return (
    <Labeled label="Genre name">
      <TextInput value={state.name} onUpdate={updateState} field={'name'} />
    </Labeled>
  )
}
