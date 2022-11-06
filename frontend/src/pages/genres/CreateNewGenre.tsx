import { Link } from 'react-router-dom'
import React, { useCallback } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay/hooks'

import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewGenreMutation } from './__generated__/CreateNewGenreMutation.graphql'

export default function CreateNewGenre() {
  const [mutate] = useMutation<CreateNewGenreMutation>(graphql`
    mutation CreateNewGenreMutation($name: String!) {
      createGenre(name: $name) {
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
            navigate('/genres/' + data.createGenre.id)
            resolve()
          },
          updater(store) {
            // TODO: implement with connections and edges
            store.invalidateStore()
          },
        })
      })
    },
    [mutate]
  )
  const returnToList = useCallback(() => {
    navigate('/genres')
  }, [])

  return (
    <MainLayout heading="Create New Genre">
      <CreateEntityForm entityType={'genre'} onSubmit={handleSubmit} onCancel={returnToList} />
    </MainLayout>
  )
}
