import React, { useCallback } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay/hooks'
import { useNavigate } from 'react-router-dom'

import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewFeatureMutation } from './__generated__/CreateNewFeatureMutation.graphql'

export default function CreateNewFeature() {
  const navigate = useNavigate()
  const [mutate] = useMutation<CreateNewFeatureMutation>(graphql`
    mutation CreateNewFeatureMutation($name: String!) {
      createFeatureType(name: $name) {
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
            navigate('/features/' + data.createFeatureType.id)
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
    navigate('/features')
  }, [navigate])

  return (
    <MainLayout heading="Create New Features">
      <CreateEntityForm entityType={'featureType'} onSubmit={handleSubmit} onCancel={returnToList} />
    </MainLayout>
  )
}
