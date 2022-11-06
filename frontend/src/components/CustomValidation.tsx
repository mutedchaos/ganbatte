import { ReactNode } from 'react'

import { useValidation } from '../contexts/Validation'

interface Props {
  isValid: boolean
  children?: ReactNode
}

export default function CustomValidation({ isValid, children }: Props) {
  useValidation(isValid)

  if (!isValid) return <>{children}</>
  return null
}
