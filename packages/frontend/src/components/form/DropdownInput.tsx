import React, { ReactNode, useCallback } from 'react'

export interface Option<TValue> {
  label: ReactNode
  value: TValue
}

interface Props<TField extends string, TValue> {
  options: Array<Option<TValue>>
  value: TValue
  field: TField
  onUpdate(update: { [key in TField]: TValue }): void
}

export default function TypedValueSelect<TField extends string, TValue>({
  options,
  value,
  field,
  onUpdate,
}: Props<TField, TValue>) {
  const nativeValue = options.findIndex((item) => item.value === value).toString()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const valueIndex = +e.target.value
      onUpdate({ [field]: options[valueIndex].value } as any)
    },
    [field, onUpdate, options]
  )

  return (
    <select value={nativeValue} onChange={handleChange}>
      {options.map((option, i) => (
        <option key={i} value={i}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
