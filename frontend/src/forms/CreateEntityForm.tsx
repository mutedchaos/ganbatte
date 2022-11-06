import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import styled from 'styled-components'

import { ValidationStatus } from '../common'
import Labeled from '../components/form/Labeled'
import TextInput from '../components/form/TextInput'
import LoadingIndicator from '../components/LoadingIndicator'
import FormControls from '../components/misc/FormControls'
import { ValidationError } from '../components/misc/ValidationError'
import { Validateable } from '../contexts/Validation'
import AvailabilityChecker from './AvailabilityChecker'

interface Props {
  onValidate?(name: string): Promise<string | null>
  onSubmit(name: string): Promise<void>
  onCancel(): void
  entityType: 'game' | 'platform' | 'businessEntity' | 'genre' | 'featureType'
}

const AbsoluteLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
`

const HiddenSpan = styled.span`
  visibility: hidden;
`

interface State {
  name: string
}

export default function CreateEntityForm({ onValidate, entityType, onSubmit, onCancel }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [validationStatus, setValidationStatus] = useState(ValidationStatus.Validating)
  const [nameValidationStatus, setNameValidationStatus] = useState(ValidationStatus.Validating)

  const [{ name }, updateState] = useReducer((state: State, update: Partial<State>) => ({ ...state, ...update }), {
    name: '',
  })

  const sanitizedName = useMemo(() => name.trim().replace(/\s{2,}/g, ' '), [name])

  useEffect(() => {
    let active = true
    setValidationStatus(ValidationStatus.Validating)
    if (!onValidate) {
      setValidationStatus(ValidationStatus.Valid)
    } else {
      onValidate(sanitizedName).then((result) => {
        if (active) {
          setValidationStatus(result ? ValidationStatus.Invalid : ValidationStatus.Valid)
        }
      })
    }
    return () => {
      active = false
    }
  }, [onValidate, sanitizedName])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitting(true)

      onSubmit(sanitizedName).catch(() => setSubmitting(false))
    },
    [onSubmit, sanitizedName]
  )

  return (
    <Validateable>
      <form onSubmit={handleSubmit}>
        {sanitizedName && (
          <AvailabilityChecker
            name={sanitizedName}
            entityType={entityType}
            onUpdateValidationStatus={setNameValidationStatus}
          />
        )}
        <Labeled label="Name">
          <TextInput autoFocus value={name} onUpdate={updateState} field="name" required />
        </Labeled>
        <div key="validation">
          {nameValidationStatus === ValidationStatus.Invalid && sanitizedName && (
            <ValidationError>An entity already exists with this name.</ValidationError>
          )}
        </div>
        <FormControls
          onCancel={onCancel}
          disableSubmit={
            validationStatus !== ValidationStatus.Valid ||
            nameValidationStatus !== ValidationStatus.Valid ||
            submitting ||
            !sanitizedName
          }
          submitLabel={
            submitting ? (
              <>
                <AbsoluteLoadingIndicator />
                <HiddenSpan>Create</HiddenSpan>
              </>
            ) : (
              'Create'
            )
          }
        />
      </form>
    </Validateable>
  )
}
