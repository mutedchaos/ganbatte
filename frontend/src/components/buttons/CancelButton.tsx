import React from 'react'
import styled from 'styled-components'

import { PlainButton } from './PlainButton'

const MyButton = styled(PlainButton)`
  color: orange;
  &:hover {
    cursor: pointer;
    color: darkorange;
    text-decoration: underline;
  }
`

export default function CancelButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <MyButton type="button" {...props}>
      {props.children ?? 'Cancel'}
    </MyButton>
  )
}
