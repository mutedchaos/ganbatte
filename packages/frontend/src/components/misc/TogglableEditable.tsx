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

const ChildContainer = styled.div<{ focused: boolean }>`
  background: ${({ focused }) => (focused ? 'lightblue' : 'white')};
  outline: 4px solid ${({ focused }) => (focused ? 'lightblue' : 'white')};
`

export default function ToggableEditable({ children, editor }: Props) {
  const [editing, setEditing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const globalEdit = !useIsEditorLocked()
  const toggle = useCallback(() => setEditing((x) => !x), [])

  const handleMouseEnter = useCallback(() => setIsFocused(true), [])
  const handleMouseLeave = useCallback(() => setIsFocused(false), [])
  return (
    <Container>
      <Content>
        {editing && globalEdit ? editor : <ChildContainer focused={isFocused}>{children}</ChildContainer>}
      </Content>
      {globalEdit && (
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} editing={editing} onClick={toggle}>
          ✎
        </Button>
      )}
    </Container>
  )
}
