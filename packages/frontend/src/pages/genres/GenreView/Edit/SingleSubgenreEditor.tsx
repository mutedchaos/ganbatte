import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
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
import { GenreAssociationType } from '../__generated__/GenreViewQuery.graphql'
import { SingleSubgenreEditorCreateMutation } from './__generated__/SingleSubgenreEditorCreateMutation.graphql'
import { SingleSubgenreEditorUpdateMutation } from './__generated__/SingleSubgenreEditorUpdateMutation.graphql'
import type { Entry } from './SubgenreEditor'

interface Props {
  parentId: string
  entry: Entry
  onDelete(id: string): void
}

interface State {
  genreId: string | null
  association: GenreAssociationType | null
}

export default function SingleSubgenreEditor({ entry, onDelete, parentId }: Props) {
  const [createMutation] = useMutation<SingleSubgenreEditorCreateMutation>(graphql`
    mutation SingleSubgenreEditorCreateMutation(
      $parentId: String!
      $childId: String!
      $association: GenreAssociationType!
    ) {
      createSubgenre(parentId: $parentId, childId: $childId, association: $association) {
        id
        association
        child {
          id
          parents {
            id
          }
        }
        parent {
          id
          subgenres {
            id
          }
        }
      }
    }
  `)
  const [updateMutation] = useMutation<SingleSubgenreEditorUpdateMutation>(graphql`
    mutation SingleSubgenreEditorUpdateMutation($id: String!, $childId: String!, $association: GenreAssociationType!) {
      updateSubgenre(id: $id, childId: $childId, association: $association) {
        id
        association
        child {
          id
          parents {
            id
          }
        }
        parent {
          id
          subgenres {
            id
          }
        }
      }
    }
  `)
  const pristineState = useMemo<State>(
    () => ({
      genreId: entry.child.id,
      association: entry.association,
    }),
    [entry.association, entry.child.id]
  )
  const handleDelete = useCallback(() => {
    onDelete(entry.id)
  }, [entry.id, onDelete])
  const handleSave = useCallback(
    async (state: State) => {
      if (entry.isNew) {
        await mutateAsPromise(createMutation, {
          variables: {
            childId: required(state.genreId),
            association: required(state.association),
            parentId,
          },
        })
        handleDelete()
      } else {
        await mutateAsPromise(updateMutation, {
          variables: {
            childId: required(state.genreId),
            association: required(state.association),
            id: entry.id,
          },
        })
      }
    },
    [createMutation, entry.id, entry.isNew, handleDelete, parentId, updateMutation]
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
          <DeleteEntityButton entityName={'n/a'} type="subgenre" typeLabel="subgenre" id={entry.id} />
        )}
      </Flex>
    </Validateable>
  )
}
