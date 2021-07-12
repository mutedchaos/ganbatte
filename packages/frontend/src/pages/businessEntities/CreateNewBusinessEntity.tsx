import { navigate } from '@reach/router'
import React, { useCallback } from 'react'
import { useMutation } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewBusinessEntityMutation } from './__generated__/CreateNewBusinessEntityMutation.graphql'

export default function CreateNewBusinessEntity() {
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
        })
      })
    },
    [mutate]
  )

  return (
    <MainLayout heading="Create New BusinessEntity">
      <CreateEntityForm entityType={'businessEntity'} onSubmit={handleSubmit} />
    </MainLayout>
  )
}
