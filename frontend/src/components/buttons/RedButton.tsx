import React from 'react'
import { ThemeProvider } from 'styled-components'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import { redTheme } from '../../theme'
import NiftyButton, { NiftyButtonProps, NiftyButtonVisual } from './NiftyButton'

export default function RedButton(props: NiftyButtonProps) {
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
