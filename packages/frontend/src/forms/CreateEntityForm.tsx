import React, { useCallback, useEffect, useState } from 'react'
import FormControls from '../components/misc/FormControls'
import { Input } from '../components/misc/Input'
import { Label } from '../components/misc/Label'

enum ValidationStatus {
  Valid,
  Validating,
  Invalid,
}

interface Props {
  onValidate(name: string): Promise<string | null>
}

export default function CreateEntityForm({ onValidate }: Props) {
  const [value, setValue] = useState('banana')
  const [validationStatus, setValidationStatus] = useState(ValidationStatus.Validating)
  const updateValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

  useEffect(() => {
    let active = true
    setValidationStatus(ValidationStatus.Validating)
    onValidate(value).then((result) => {
      if (active) {
        setValidationStatus(result ? ValidationStatus.Invalid : ValidationStatus.Valid)
      }
    })
    return () => {
      active = false
    }
  }, [onValidate, value])

  return (
    <form>
      <Label>Name</Label>
      <Input autoFocus value={value} onChange={updateValue} />
      {validationStatus === ValidationStatus.Invalid && <div>ValidationError</div>}
      <FormControls disableSubmit={validationStatus !== ValidationStatus.Valid} submitLabel={'Create'} />
    </form>
  )
}
