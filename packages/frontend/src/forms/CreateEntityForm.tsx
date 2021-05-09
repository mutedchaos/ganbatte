import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ValidationStatus } from '../common'
import FormControls from '../components/misc/FormControls'
import { Input } from '../components/misc/Input'
import { Label } from '../components/misc/Label'
import { ValidationError } from '../components/misc/ValidationError'
import AvailabilityChecker from './AvailabilityChecker'

interface Props {
  onValidate(name: string): Promise<string | null>
  entityType: 'game'
}

export default function CreateEntityForm({ onValidate, entityType }: Props) {
  const [value, setValue] = useState('banana')
  const [validationStatus, setValidationStatus] = useState(ValidationStatus.Validating)
  const [nameValidationStatus, setNameValidationStatus] = useState(ValidationStatus.Validating)
  const updateValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

  const sanitizedName = useMemo(() => value.trim().replace(/\s{2,}/g, ' '), [value])

  useEffect(() => {
    let active = true
    setValidationStatus(ValidationStatus.Validating)
    onValidate(sanitizedName).then((result) => {
      if (active) {
        setValidationStatus(result ? ValidationStatus.Invalid : ValidationStatus.Valid)
      }
    })
    return () => {
      active = false
    }
  }, [onValidate, sanitizedName])

  return (
    <form>
      <AvailabilityChecker
        name={sanitizedName}
        entityType={entityType}
        onUpdateValidationStatus={setNameValidationStatus}
      />
      <Label>Name</Label>
      <Input autoFocus value={value} onChange={updateValue} />
      <div key="validation">
        {nameValidationStatus === ValidationStatus.Invalid && (
          <ValidationError>An entity already exists with this name.</ValidationError>
        )}
      </div>
      <FormControls
        disableSubmit={validationStatus !== ValidationStatus.Valid || nameValidationStatus !== ValidationStatus.Valid}
        submitLabel={'Create'}
      />
    </form>
  )
}
