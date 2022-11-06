import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { asDate, intepreteDate } from '../../common/dateUtils'
import { useValidation } from '../../contexts/Validation'

interface Props<TField extends string> {
  value: Date | null
  field: TField

  onUpdate(update: { [key in TField]: Date | null }): void
}

const Input = styled.input<{ isValid: boolean }>`
  ${({ isValid }) =>
    !isValid &&
    css`
      outline: 1px solid red;
    `}
`

export default function DateInput<TField extends string>({ value, onUpdate, field }: Props<TField>) {
  const parsed = useMemo(() => intepreteDate(value), [value])
  const [tempValue, setTempValue] = useState(parsed.value)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setTempValue(newValue)
      const newDate = asDate(newValue)
      onUpdate({ [field]: newDate && isNaN(newDate?.valueOf()) ? null : newDate } as { [key in TField]: Date | null })
    },
    [field, onUpdate]
  )

  const isValid = parsed.value === tempValue.toUpperCase() || !tempValue
  useValidation(isValid)

  return (
    <>
      <Input isValid={isValid} value={tempValue} onChange={handleChange} /> {parsed.formatted}
    </>
  )
}
