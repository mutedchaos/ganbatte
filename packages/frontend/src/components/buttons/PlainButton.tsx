import styled, { css } from 'styled-components'

import { ButtonVisual } from './base'

const disabledStyle = css`
  background: lightgray;
  color: darkgray;
  box-shadow: none;
`

export const PlainButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  &:disabled ${ButtonVisual} {
    ${disabledStyle}
    &:hover {
      ${disabledStyle}
      transform: none;
    }
  }
`

export const TransparentButton = PlainButton
