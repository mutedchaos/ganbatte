import React, { ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { useValidation } from '../../contexts/Validation'

export interface Option<TValue> {
  label: ReactNode
  value: TValue
}

interface Props<TField extends string, TValue> {
  options: Array<Option<TValue>>
  value: TValue
  field: TField
  onUpdate(update: { [key in TField]: TValue }): void
  required?: boolean
}

const Select = styled.select<{ isValid: boolean }>`
  ${({ isValid }) =>
    !isValid &&
    css`
      outline: 1px solid red;
    `}
`

export default function TypedValueSelect<TField extends string, TValue>({
  options,
  value,
  field,
  onUpdate,
  required,
}: Props<TField, TValue>) {
  const nativeValue = options.findIndex((item) => item.value === value).toString()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const valueIndex = +e.target.value
      onUpdate({ [field]: options[valueIndex].value } as any)
    },
    [field, onUpdate, options]
  )

  const isValid = !required || (value !== undefined && value !== null)
  useValidation(isValid)

  return (
    <Select isValid={isValid} value={nativeValue} onChange={handleChange}>
      {options.map((option, i) => (
        <option key={i} value={i}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
