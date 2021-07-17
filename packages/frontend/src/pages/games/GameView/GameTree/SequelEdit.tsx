import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'
import styled from 'styled-components'

import DeleteEntityButton, { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../../common/mutateAsPromise'
import required from '../../../../common/required'
import CustomValidation from '../../../../components/CustomValidation'
import DropdownInput, { ListOption } from '../../../../components/form/DropdownInput'
import Labeled from '../../../../components/form/Labeled'
import GameDropdown from '../../../../components/form/specific/GameDropdown'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { Validateable } from '../../../../contexts/Validation'
import { SequelType } from './__generated__/GameTreeEditorQuery.graphql'
import { SequelEditCreateMutation } from './__generated__/SequelEditCreateMutation.graphql'
import type { Entry } from './SequelEditor'

interface Props {
  entry: Entry
  otherGameId: string
  field: 'successor' | 'predecessor'
  onDelete?(id: string): void
}

const Flex = styled.div`
  display: flex;
  > * {
    margin-right: 20px;
  }
`

interface State {
  gameId: string | null
  sequelType: SequelType | null
}

const ValidationError = styled.p`
  color: red;
`

const options: Array<ListOption<SequelType | null>> = [
  {
    value: null,
    label: 'No selection',
  },
  { value: 'DirectSequel', label: 'Direct Sequel' },
  { value: 'Prequel', label: 'Prequel' },
  { value: 'Reboot', label: 'Reboot' },
  { value: 'Remaster', label: 'Remaster' },
  { value: 'SpiritualSequel', label: 'Spiritual Sequel' },
]

export default function SequelEdit({ entry, field, otherGameId, onDelete }: Props) {
  const pristineValue = useMemo<State>(
    () => ({
      gameId: entry[field].id,
      sequelType: entry.sequelType,
    }),
    [entry, field]
  )

  const [mutate] = useMutation<SequelEditCreateMutation>(
    graphql`
      mutation SequelEditCreateMutation($successor: String!, $predecessor: String!, $sequelType: SequelType!) {
        createSequel(successor: $successor, predecessor: $predecessor, sequelType: $sequelType) {
          id
          sequels {
            id
            sequelType
            predecessor {
              id
            }
            successor {
              id
            }
          }
          sequelOf {
            id
            sequelType
            predecessor {
              id
            }
            successor {
              id
            }
          }
        }
      }
    `
  )

  const deleteSelf = useCallback(() => {
    onDelete?.(entry.id)
  }, [entry.id, onDelete])

  const { state, updateState, validate } = useEditing(pristineValue, async (state) => {
    if (entry.isNew) {
      await mutateAsPromise(mutate, {
        variables: {
          successor: field === 'successor' ? required(state.gameId) : otherGameId,
          predecessor: field === 'successor' ? otherGameId : required(state.gameId),
          sequelType: required(state.sequelType),
        },
      })
      deleteSelf()
    } else {
      throw new Error('NYI')
    }
  })
  return (
    <Validateable onValidate={validate}>
      <Flex>
        <Labeled label="Game">
          <GameDropdown required value={state.gameId} field="gameId" onUpdate={updateState} />
          <CustomValidation isValid={state.gameId !== otherGameId}>
            <ValidationError>Cannot make a game its own predecessor or sequel.</ValidationError>
          </CustomValidation>
        </Labeled>

        <Labeled label="Sequel type">
          <DropdownInput<'sequelType', SequelType | null>
            required
            value={state.sequelType}
            field="sequelType"
            options={options}
            onUpdate={updateState}
          />
        </Labeled>
        {entry.isNew ? (
          <DeleteEntityButtonVisual onClick={deleteSelf} />
        ) : (
          <DeleteEntityButton id={entry.id} entityName={otherGameId} type={'sequel'} typeLabel={'sequel'} />
        )}
      </Flex>
    </Validateable>
  )
}
