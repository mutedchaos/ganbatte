import React from 'react'
import { ThemeProvider } from 'styled-components'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import { orangeTheme } from '../../theme'
import NiftyButton, { NiftyButtonVisual } from './NiftyButton'

export default function OrangeButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ThemeProvider theme={orangeTheme}>
      <NiftyButton {...props} />
    </ThemeProvider>
  )
}

export function OrangeButtonVisual(props: ChildrenOnlyProps) {
  return (
    <ThemeProvider theme={orangeTheme}>
      <NiftyButtonVisual {...props} />
    </ThemeProvider>
  )
}
