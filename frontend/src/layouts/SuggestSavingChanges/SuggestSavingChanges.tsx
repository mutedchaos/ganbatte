import { useContext } from 'react'
import styled from 'styled-components'

import CancelButton from '../../components/buttons/CancelButton'
import { SubmitButton } from '../../components/buttons/SubmitButton'
import { globalEditContext } from '../../contexts/ActiveEditingContext'

const Container = styled.div`
  position: fixed;
  right: 10px;
  top: 40px;
  border: 4px solid gold;
  padding: 20px;
  background: #ffe;
`

const Prompt = styled.h2`
  font-size: 1.25em;
`

export default function SuggestSavingChanges() {
  const status = useContext(globalEditContext)
  if (!status.isDirty) return null
  return (
    <Container>
      <Prompt>There are unsaved changes.</Prompt>
      <SubmitButton disabled={!status.isValid || status.isSaving} onClick={status.saveAllChanges}>
        Save
      </SubmitButton>{' '}
      <CancelButton onClick={status.resetAllChanges}>Reset</CancelButton>
    </Container>
  )
}
