import styled from 'styled-components'

const Elem = styled.div`
  align-self: center;
  font-style: italic;
  margin-right: 20px;
  font-size: 1.2em;
  color: white;
  text-shadow: 3px 3px 3px black;
`

export default function AppTitle() {
  return <Elem>Ganbatte</Elem>
}
