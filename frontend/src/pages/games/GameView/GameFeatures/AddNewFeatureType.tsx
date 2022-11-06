import { useCallback, useState } from 'react'
import styled from 'styled-components'

import required from '../../../../common/required'
import CancelButton from '../../../../components/buttons/CancelButton'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import FeatureTypeDropdown from '../../../../components/form/specific/FeatureTypeDropdown'
import { Validateable } from '../../../../contexts/Validation'

const Container = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 20px;
  }
`

interface Props {
  excludedIds: string[]
  onAdd(id: string): void
  onCancel(): void
}

interface State {
  typeId: string | null
}

export default function AddNewFeatureType({ excludedIds, onAdd, onCancel }: Props) {
  const [state, updateState] = useState<State>({ typeId: null })

  const handleAdd = useCallback(() => {
    onAdd(required(state.typeId))
  }, [onAdd, state.typeId])

  return (
    <Validateable>
      <Container>
        <span>New feature type</span>
        <FeatureTypeDropdown
          excludedIds={excludedIds}
          value={state.typeId}
          onUpdate={updateState}
          field="typeId"
          required
        />
        <OrangeButton disabled={!state.typeId} onClick={handleAdd}>
          Add
        </OrangeButton>
        <CancelButton onClick={onCancel} />
      </Container>
    </Validateable>
  )
}
