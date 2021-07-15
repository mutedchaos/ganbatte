import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ValidationStatus } from '../common'
import LoadingIndicator from '../components/LoadingIndicator'
import FormControls from '../components/misc/FormControls'
import { Input } from '../components/misc/Input'
import { Label } from '../components/misc/Label'
import { ValidationError } from '../components/misc/ValidationError'
import AvailabilityChecker from './AvailabilityChecker'

interface Props {
  onValidate?(name: string): Promise<string | null>
  onSubmit(name: string): Promise<void>
  onCancel(): void
  entityType: 'game' | 'platform' | 'businessEntity'
}

const AbsoluteLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
`

const HiddenSpan = styled.span`
  visibility: hidden;
`

export default function CreateEntityForm({ onValidate, entityType, onSubmit, onCancel }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')
  const [validationStatus, setValidationStatus] = useState(ValidationStatus.Validating)
  const [nameValidationStatus, setNameValidationStatus] = useState(ValidationStatus.Validating)
  const updateValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

  const sanitizedName = useMemo(() => value.trim().replace(/\s{2,}/g, ' '), [value])

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

      onSubmit(sanitizedName).catch((err) => setSubmitting(false))
    },
    [onSubmit, sanitizedName]
  )

  return (
    <form onSubmit={handleSubmit}>
      {sanitizedName && (
        <AvailabilityChecker
          name={sanitizedName}
          entityType={entityType}
          onUpdateValidationStatus={setNameValidationStatus}
        />
      )}
      <Label>Name</Label>
      <Input autoFocus value={value} onChange={updateValue} />
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
  )
}
