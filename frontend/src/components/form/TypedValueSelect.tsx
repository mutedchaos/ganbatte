import React, { useCallback } from 'react'

export interface StringLabeledOption<TValue> {
  label: string
  value: TValue
}

interface Props<TValue> {
  options: Array<StringLabeledOption<TValue>>
  value: TValue
  onChange(value: TValue): void
}

export default function TypedValueSelect<TValue>({ options, value, onChange }: Props<TValue>) {
  const nativeValue = options.findIndex((item) => item.value === value).toString()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const valueIndex = +e.target.value
      onChange(options[valueIndex].value)
    },
    [onChange, options]
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
