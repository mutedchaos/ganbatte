import { ReactNode, useMemo, useState } from 'react'
import styled from 'styled-components'

import { RequiredCtx, requiredContext } from '../../contexts/requiredContext'

interface Props {
  label: ReactNode
  sublabel?: ReactNode
  children: ReactNode
  required?: boolean
}
const Container = styled.div`
  margin-top: 10px;
  border-bottom: 1px dotted lightgray;
  padding-bottom: 10px;
`
const Label = styled.div`
  margin-bottom: 5px;
`
const Body = styled.div`
  margin-left: 10px;
`
const Sublabel = styled.div`
  margin-top: -5px;
  margin-bottom: 5px;
  font-size: 0.8em;
`

const Required = styled.span`
  color: red;
`

export default function Labeled({ label, children, sublabel, required }: Props) {
  const [ctxRequired, setCtxRequired] = useState(false)

  const requiredContextValue = useMemo<RequiredCtx>(
    () => ({
      setRequired: setCtxRequired,
    }),
    []
  )

  return (
    <requiredContext.Provider value={requiredContextValue}>
      <Container>
        <Label>
          {label}
          {required || (ctxRequired && <Required>*</Required>)}
        </Label>
        {sublabel && <Sublabel>{sublabel}</Sublabel>}
        <Body>{children}</Body>
      </Container>
    </requiredContext.Provider>
  )
}
