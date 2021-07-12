import { navigate } from '@reach/router'
import React, { useCallback } from 'react'
import { useMutation } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewPlatformMutation } from './__generated__/CreateNewPlatformMutation.graphql'

export default function CreateNewPlatform() {
  const [mutate] = useMutation<CreateNewPlatformMutation>(graphql`
    mutation CreateNewPlatformMutation($name: String!) {
      createPlatform(name: $name) {
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
            navigate('/platforms/' + data.createPlatform.id)
            resolve()
          },
        })
      })
    },
    [mutate]
  )

  return (
    <MainLayout heading="Create New Platform">
      <CreateEntityForm entityType={'platform'} onSubmit={handleSubmit} />
    </MainLayout>
  )
}