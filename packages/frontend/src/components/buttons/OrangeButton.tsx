import { ReactNode } from 'react'
import styled from 'styled-components'

const Visual = styled.div`
  background: orange;
  display: inline-block;
  text-decoration: none;
  padding: 10px 40px;
  border-radius: 5px;
  color: black;
  transform: translateY(0);
  box-shadow: 0 3px 5px #ff940f70;
  &:hover {
    background: gold;
    box-shadow: 0 5px 5px #ff940f70;
    transform: translateY(-2px);
  }

  &:active {
    background: gold;
    box-shadow: 0 1px 5px #ff940f70;
    transform: translateY(2px);
  }
  transition: background-color 100ms linear, box-shadow 100ms linear, transform 100ms linear; ;
`
interface Props {
  children: ReactNode
}

export default function OrangeButtonVisual({ children }: Props) {
  return <Visual>{children}</Visual>
}
