import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { ButtonVisual } from './base'
import { PlainButton } from './PlainButton'

const Visual = styled(ButtonVisual)`
  background: ${({ theme }) => theme.button.backgroundColor};
  display: inline-block;
  text-decoration: none;
  padding: 10px 40px;
  border-radius: 5px;
  color: black;
  transform: translateY(0);
  box-shadow: 0 3px 5px ${({ theme }) => theme.button.shadowColor};
  &:hover {
    background: ${({ theme }) => theme.button.hoverBackgroundColor};
    box-shadow: 0 5px 5px ${({ theme }) => theme.button.shadowColor};
    transform: translateY(-2px);
  }

  &:active {
    background: ${({ theme }) => theme.button.hoverBackgroundColor};
    box-shadow: 0 1px 5px ${({ theme }) => theme.button.shadowColor};
    transform: translateY(2px);
  }
  transition: background-color 100ms linear, box-shadow 100ms linear, transform 100ms linear; ;
`
interface Props {
  children: ReactNode
}

export function NiftyButtonVisual({ children }: Props) {
  return <Visual>{children}</Visual>
}

export default function NiftyButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...otherProps } = props

  return (
    <PlainButton {...otherProps}>
      <NiftyButtonVisual>{children}</NiftyButtonVisual>
    </PlainButton>
  )
}
