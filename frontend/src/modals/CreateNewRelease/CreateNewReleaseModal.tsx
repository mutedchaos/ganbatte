import React, { useCallback, useReducer } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import { useCachedData } from '../../common/CachedDataProvider'
import DateInput from '../../components/form/DateInput'
import Labeled from '../../components/form/Labeled'
import BusinessEntityInput from '../../components/form/specific/AutocompleteInput'
import TextInput from '../../components/form/TextInput'
import { headings } from '../../components/headings'
import FormControls from '../../components/misc/FormControls'
import { ModalProps } from '../../contexts/modal'
import { Validateable } from '../../contexts/Validation'
import { CreateNewReleaseModalMutation } from './__generated__/CreateNewReleaseModalMutation.graphql'
import PlatformCheckboxes from './PlatformCheckboxes'

type Props = ModalProps

interface State {
  platforms: string[]
  developer: string | null
  releaseDate: null | Date
  publisher: string | null
  specifier: string
}

const initialState: State = {
  platforms: [],
  developer: null,
  publisher: null,
  releaseDate: null,
  specifier: '',
}

export default function CreateNewReleaseModal({ onClose }: Props) {
  const [mutate] = useMutation<CreateNewReleaseModalMutation>(graphql`
    mutation CreateNewReleaseModalMutation($data: CreateRelease!) {
      createReleases(data: $data) {
        id
        releases {
          id
        }
      }
    }
  `)

  const { game } = useCachedData('game')

  const [state, updateState] = useReducer((state: State, mods: Partial<State>) => ({ ...state, ...mods }), initialState)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      mutate({
        variables: {
          data: {
            gameId: game.id,
            ...state,
            releaseDate: state.releaseDate?.toISOString(),
            publisher: state.publisher?.trim() || null,
            developer: state.publisher?.trim() || null,
          },
        },
        onCompleted() {
          onClose()
        },
      })
    },
    [game.id, mutate, onClose, state]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Validateable>
        <headings.Modal>Create a release</headings.Modal>
        {game.releases.length ? <Labeled label="Based on another release">x</Labeled> : null}
        <Labeled label={'Platform(s)'}>
          <PlatformCheckboxes value={state.platforms} field="platforms" onUpdate={updateState} />
        </Labeled>
        <Labeled label="Additional information to identify the release">
          <TextInput value={state.specifier} field="specifier" onUpdate={updateState} />
        </Labeled>
        <Labeled label="Release date">
          <DateInput value={state.releaseDate} field="releaseDate" onUpdate={updateState} />
        </Labeled>
        <Labeled label="Developer" sublabel="If you need to add many, please do so after creation.">
          <BusinessEntityInput value={state.developer} field="developer" onUpdate={updateState} type="businessEntity" />
        </Labeled>
        <Labeled label="Publisher" sublabel="If you need to add many, please do so after creation.">
          <BusinessEntityInput value={state.publisher} field="publisher" onUpdate={updateState} type="businessEntity" />
        </Labeled>
        <FormControls submitLabel="Create Release" onCancel={onClose} />
      </Validateable>
    </form>
  )
}
