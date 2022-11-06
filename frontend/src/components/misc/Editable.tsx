import React, { ReactNode } from 'react'

import { useIsEditorLocked } from '../../contexts/EditorLockContext'

interface Props {
  editor: ReactNode
  children?: ReactNode
}

export default function Editable({ children, editor }: Props) {
  const editing = !useIsEditorLocked()
  return <>{editing ? editor : children}</>
}
