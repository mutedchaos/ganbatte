import React, { useCallback } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay/hooks'
import { useNavigate } from 'react-router-dom'

import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewBusinessEntityMutation } from './__generated__/CreateNewBusinessEntityMutation.graphql'

export default function CreateNewBusinessEntity() {
  const navigate = useNavigate()
  const [mutate] = useMutation<CreateNewBusinessEntityMutation>(graphql`
    mutation CreateNewBusinessEntityMutation($name: String!) {
      createBusinessEntity(name: $name) {
        id
      }
    }
  `)

  const handleSubmit = useCallback(
    (name: string) => {
      return new Promise<void>((resolve, reject) => {
        mutate({
          variables: { name },
          onError: reject,
          onCompleted(data) {
            navigate('/businessEntities/' + data.createBusinessEntity.id)
            resolve()
          },
          updater(store) {
            // TODO: implement with connections and edges
            store.invalidateStore()
          },
        })
      })
    },
    [mutate, navigate]
  )

  const returnToList = useCallback(() => {
    navigate('/businessentities')
  }, [navigate])

  return (
    <MainLayout heading="Create New BusinessEntity">
      <CreateEntityForm entityType={'businessEntity'} onSubmit={handleSubmit} onCancel={returnToList} />
    </MainLayout>
  )
}
