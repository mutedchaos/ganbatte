import React, { useCallback } from 'react'
import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function CreateNewGame() {
  const tempValidate = useCallback(async (value: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return value.includes('a') ? 'Cannot contain a' : null
  }, [])

  return (
    <MainLayout heading="Create New Game">
      <CreateEntityForm onValidate={tempValidate} />
    </MainLayout>
  )
}
