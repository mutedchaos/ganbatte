import React, { useCallback } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay/hooks'
import { useNavigate } from 'react-router-dom'

import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewGameMutation } from './__generated__/CreateNewGameMutation.graphql'

export default function CreateNewGame() {
  const navigate = useNavigate()

  const [mutate] = useMutation<CreateNewGameMutation>(graphql`
    mutation CreateNewGameMutation($name: String!) {
      createGame(name: $name) {
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
            navigate('/games/' + data.createGame.id)
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
    navigate('/games')
  }, [navigate])

  return (
    <MainLayout heading="Create New Game">
      <CreateEntityForm entityType={'game'} onSubmit={handleSubmit} onCancel={returnToList} />
    </MainLayout>
  )
}
