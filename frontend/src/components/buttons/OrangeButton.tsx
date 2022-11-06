import React from 'react'
import { ThemeProvider } from 'styled-components'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import { orangeTheme } from '../../theme'
import NiftyButton, { NiftyButtonProps, NiftyButtonVisual } from './NiftyButton'

export default function OrangeButton(props: NiftyButtonProps) {
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
