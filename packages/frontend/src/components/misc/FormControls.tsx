import React, { ReactNode } from 'react'
import styled from 'styled-components'

import CancelButton from '../buttons/CancelButton'
import { SubmitButton } from '../buttons/SubmitButton'

interface Props {
  disableSubmit?: boolean
  submitLabel: ReactNode
  onCancel(): void
}

const Container = styled.div`
  margin-top: 30px;
  button {
    margin-right: 30px;
  }
`

export default function FormControls({ disableSubmit, submitLabel, onCancel }: Props) {
  return (
    <Container>
      <SubmitButton disabled={disableSubmit}>{submitLabel}</SubmitButton>
      <CancelButton onClick={onCancel} />
    </Container>
  )
}
