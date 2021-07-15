import styled from 'styled-components'

const Container = styled.div`
  z-index: 1000;
  background: black;
  opacity: 0.2;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

interface Props {
  onClick(): void
}

export default function Overlay({ onClick }: Props) {
  return <Container onClick={onClick} />
}
