import { useCallback, useMemo } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../../common/mutateAsPromise'
import required from '../../../../common/required'
import Labeled from '../../../../components/form/Labeled'
import GenreAssociationInput from '../../../../components/form/specific/GenreAssociationInput'
import GenreDropdown from '../../../../components/form/specific/GenreDropdown'
import { Flex } from '../../../../components/styles/Flex'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { Validateable } from '../../../../contexts/Validation'
import { GenreAssociationType } from '../__generated__/GameViewQuery.graphql'
import { SingleGameGenreEditorCreateMutation } from './__generated__/SingleGameGenreEditorCreateMutation.graphql'
import { SingleGameGenreEditorUpdateMutation } from './__generated__/SingleGameGenreEditorUpdateMutation.graphql'
import type { Entry } from './GameGenreEditor'

interface Props {
  gameId: string
  entry: Entry
  onDelete(id: string): void
}

interface State {
  genreId: string | null
  association: GenreAssociationType | null
}

export default function SingleGameGenreEditor({ entry, onDelete, gameId }: Props) {
  const [createMutation] = useMutation<SingleGameGenreEditorCreateMutation>(graphql`
    mutation SingleGameGenreEditorCreateMutation(
      $gameId: String!
      $genreId: String!
      $association: GenreAssociationType!
    ) {
      addGameGenre(gameId: $gameId, genreId: $genreId, association: $association) {
        id
        association
        genre {
          id
        }
        game {
          id
          genres {
            id
            association
            genre {
              id
            }
          }
          relatedGenres {
            id
            name
            subgenres {
              association
              child {
                id
              }
            }
          }
        }
      }
    }
  `)

  const [updateMutation] = useMutation<SingleGameGenreEditorUpdateMutation>(graphql`
    mutation SingleGameGenreEditorUpdateMutation($id: String!, $genreId: String!, $association: GenreAssociationType!) {
      updateGameGenre(id: $id, genreId: $genreId, association: $association) {
        id
        association
        genre {
          id
        }
        game {
          id
          genres {
            id
            association
            genre {
              id
            }
          }
          relatedGenres {
            id
            name
            subgenres {
              association
              child {
                id
              }
            }
          }
        }
      }
    }
  `)
  const pristineState = useMemo<State>(
    () => ({
      genreId: entry.genre.id,
      association: entry.association,
    }),
    [entry.association, entry.genre.id]
  )
  const handleDelete = useCallback(() => {
    onDelete(entry.id)
  }, [entry.id, onDelete])
  const handleSave = useCallback(
    async (state: State) => {
      if (entry.isNew) {
        await mutateAsPromise(createMutation, {
          variables: {
            genreId: required(state.genreId),
            association: required(state.association),
            gameId,
          },
        })
        handleDelete()
      } else {
        await mutateAsPromise(updateMutation, {
          variables: {
            genreId: required(state.genreId),
            association: required(state.association),
            id: entry.id,
          },
        })
      }
    },
    [createMutation, entry.id, entry.isNew, gameId, handleDelete, updateMutation]
  )

  const { state, updateState, validate } = useEditing(pristineState, handleSave)
  return (
    <Validateable onValidate={validate}>
      <Flex>
        <Labeled label="Genre">
          <GenreDropdown required value={state.genreId} field="genreId" onUpdate={updateState} />
        </Labeled>
        <Labeled label="Association">
          <GenreAssociationInput value={state.association} onUpdate={updateState} field="association" required />
        </Labeled>
        {entry.isNew ? (
          <DeleteEntityButtonVisual onClick={handleDelete} />
        ) : (
          <DeleteEntityButton entityName={entry.genre.name} type="gamegenre" typeLabel="game genre" id={entry.id} />
        )}
      </Flex>
    </Validateable>
  )
}
