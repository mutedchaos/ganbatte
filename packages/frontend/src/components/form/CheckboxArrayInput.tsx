import React, { ReactNode, useCallback } from 'react'
import styled from 'styled-components'

interface Props<TField extends string, TValue> {
  value: TValue[]
  field: TField
  options: Array<{ label: ReactNode; value: TValue; key: string }>
  onUpdate(update: { [key in TField]: TValue[] }): void
}

const Label = styled.label`
  user-select: none;
`

export default function TextInput<TField extends string, TValue>({
  value,
  onUpdate,
  field,
  options,
}: Props<TField, TValue>) {
  const toggle = useCallback(
    (newValue: TValue, checked: boolean) => {
      if (checked) {
        onUpdate({ [field]: [...value, newValue] } as any)
      } else {
        onUpdate({ [field]: value.filter((v) => v !== newValue) } as any)
      }
    },
    [field, onUpdate, value]
  )

  return (
    <div>
      {options.map((option) => (
        <div key={option.key}>
          <Label>
            {' '}
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => toggle(option.value, e.target.checked)}
            />{' '}
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
}
