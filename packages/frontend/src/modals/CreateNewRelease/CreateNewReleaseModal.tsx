import React, { useCallback, useReducer } from 'react'

import { useCachedData } from '../../common/CachedDataProvider'
import DateInput from '../../components/form/DateInput'
import Labeled from '../../components/form/Labeled'
import BusinessEntityInput from '../../components/form/specific/AutocompleteInput'
import TextInput from '../../components/form/TextInput'
import { headings } from '../../components/headings'
import FormControls from '../../components/misc/FormControls'
import { ModalProps } from '../../contexts/modal'

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
  const { game } = useCachedData('game')
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose() // TODO: actually submit
    },
    [onClose]
  )

  const [state, updateState] = useReducer((state: State, mods: Partial<State>) => ({ ...state, ...mods }), initialState)

  return (
    <form onSubmit={handleSubmit}>
      <headings.Modal>Create a release</headings.Modal>
      {game.releases.length ? <Labeled label="Based on another release">x</Labeled> : null}
      <Labeled label={'Platform(s)'} sublabel="Choose at least one">
        x
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
    </form>
  )
}
