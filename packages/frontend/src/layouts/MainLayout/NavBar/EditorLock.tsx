import React, { useCallback } from 'react'
import styled from 'styled-components'

import { useIsEditorLocked, useToggleEditorLock } from '../../../contexts/EditorLockContext'

const Container = styled.div`
  align-self: center;
  margin: 0 10px;
  cursor: pointer;
  user-select: none;
`

export default function EditorLock() {
  const isLocked = useIsEditorLocked()

  const toggleEditorLock = useToggleEditorLock()

  const toggle = useCallback(() => {
    toggleEditorLock(!isLocked)
  }, [isLocked, toggleEditorLock])

  return <Container onClick={toggle}>{isLocked ? '🔒' : '🔓'}</Container>
}
