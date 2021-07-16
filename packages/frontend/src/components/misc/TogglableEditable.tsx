import React, { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useIsEditorLocked } from '../../contexts/EditorLockContext'

interface Props {
  editor: ReactNode
  children?: ReactNode
}

const Container = styled.div`
  display: flex;
`
const Content = styled.div`
  flex-grow: 1;
`
const Button = styled.button<{ editing: boolean }>`
  align-self: flex-start;
  color: ${({ editing }) => (editing ? 'blue' : 'black')};
`

export default function ToggalbleEditable({ children, editor }: Props) {
  const [editing, setEditing] = useState(false)
  const globalEdit = !useIsEditorLocked()
  const toggle = useCallback(() => setEditing((x) => !x), [])
  return (
    <Container>
      <Content>{editing && globalEdit ? editor : children}</Content>
      {globalEdit && (
        <Button editing={editing} onClick={toggle}>
          ✎
        </Button>
      )}
    </Container>
  )
}
