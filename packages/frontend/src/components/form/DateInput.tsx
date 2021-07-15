import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { asDate, intepreteDate } from '../../common/dateUtils'

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
      onUpdate({ [field]: asDate(newValue) } as { [key in TField]: Date | null })
    },
    [field, onUpdate]
  )

  return (
    <>
      <Input isValid={parsed.value === tempValue.toUpperCase()} value={tempValue} onChange={handleChange} />{' '}
      {parsed.formatted}
    </>
  )
}
