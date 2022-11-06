import styled from 'styled-components'

import ModalHeading from './ModalHeading'
import PageHeading from './PageHeading'

const BlockHeading = styled.h3`
  background: deepskyblue;
  color: white;
  font-size: 14px;
  padding: 5px;
`

export const headings = { Page: PageHeading, Modal: ModalHeading, BlockHeading }
