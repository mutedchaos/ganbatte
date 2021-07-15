import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import { redTheme } from '../../theme'
import NiftyButton, { NiftyButtonVisual } from './NiftyButton'


export default function RedButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ThemeProvider theme={redTheme}>
      <NiftyButton {...props} />
    </ThemeProvider>
  )
}

export function RedButtonVisual(props: ChildrenOnlyProps) {
  return (
    <ThemeProvider theme={redTheme}>
      <NiftyButtonVisual {...props} />
    </ThemeProvider>
  )
}
