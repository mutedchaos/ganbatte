import React from 'react'

import { useIsFailingValidation } from '../../contexts/Validation'

export default function ValidatedButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isInvalid = useIsFailingValidation()
  return <button {...props} disabled={props.disabled || isInvalid} />
}
