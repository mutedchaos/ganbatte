import { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  data: any
  label: ReactNode
}

const DebugContainer = styled.div`
  white-space: pre-wrap;
  margin: 10px;
  border: 5px solid deepskyblue;
  background: lightyellow;
  padding: 10px;
  border-radius: 10px;
`

export default function DebugView({ data, label }: Props) {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((x) => !x), [])

  return (
    <>
      <button onClick={toggle}>Debug: {label}</button>
      {open && <DebugContainer>{JSON.stringify(data, null, 2)}</DebugContainer>}
    </>
  )
}
