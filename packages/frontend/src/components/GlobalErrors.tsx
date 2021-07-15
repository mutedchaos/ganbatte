import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getVaguelyUniqueId } from '../common/useVaguelyUniqueId'


interface MyError {
  message: string
  details: any
  date: Date
  key: string
}

let trigger: null | (() => void) = null

const errors: MyError[] = []

const Container = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
`
const Error = styled.div`
  background: red;
  display: flex;
  > :nth-child(1) {
    width: 240px;
    padding: 2px;
  }

  > :nth-child(2) {
    flex-grow: 1;
    white-space: pre-line;
  }
`
const Hidden = styled.div`
  display: none;
`

export default function GlobalErrors() {
  const [version, setVersion] = useState(0)

  version.toString()

  useEffect(() => {
    trigger = () => setVersion((v) => v + 1)
    return () => {
      trigger = null
    }
  }, [])

  return (
    <Container>
      {[...errors].reverse().map((error) => (
        <Error key={error.key}>
          <span>{error.date.toISOString()}</span>
          <span>{error.message}</span>
          <Hidden>{JSON.stringify(error.details, null, 2)}</Hidden>{' '}
          <button
            onClick={() => {
              errors.splice(errors.indexOf(error), 1)
              trigger?.()
            }}
          >
            ok
          </button>
        </Error>
      ))}
    </Container>
  )
}

export function addGlobalError(error: any) {
  errors.push({
    message: error.message || JSON.stringify(error),
    details: error,
    date: new Date(),

    key: getVaguelyUniqueId(),
  })
  trigger?.()
}
