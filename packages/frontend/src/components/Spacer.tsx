import styled from 'styled-components'

interface Props {
  width: string
}

const Container = styled.div<{ width: string }>`
  display: inline-block;
  width: ${({ width }) => width};
`

export default function Spacer({ width }: Props) {
  return <Container width={width} />
}
