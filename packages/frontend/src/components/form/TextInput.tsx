import React, { useCallback } from 'react'

interface Props<TField extends string> {
  value: string
  field: TField

  onUpdate(update: { [key in TField]: string }): void
}

export default function TextInput<TField extends string>({ value, onUpdate, field }: Props<TField>) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onUpdate({ [field]: newValue } as { [key in TField]: string })
    },
    [field, onUpdate]
  )

  return <input value={value} onChange={handleChange} />
}
