import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import { useSetRequired } from '../../contexts/requiredContext'
import { useValidation } from '../../contexts/Validation'

type Props<TField extends string> = {
  value: string
  field: TField

  onUpdate(update: { [key in TField]: string }): void
  onValidate?(value: string): boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

const Input = styled.input<{ isValid: boolean }>`
  ${({ isValid }) =>
    !isValid &&
    css`
      outline: 1px solid red;
    `}
`

export default function TextInput<TField extends string>({
  value,
  onUpdate,
  field,
  onValidate,
  ...otherProps
}: Props<TField>) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onUpdate({ [field]: newValue } as { [key in TField]: string })
    },
    [field, onUpdate]
  )

  useSetRequired(!!otherProps.required)
  const isValid = (!otherProps.required || !!value.trim()) && (onValidate?.(value) ?? true)
  useValidation(isValid)

  return <Input isValid={isValid} value={value} onChange={handleChange} {...otherProps} />
}
