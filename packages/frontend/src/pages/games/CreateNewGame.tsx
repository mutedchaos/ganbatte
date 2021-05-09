import { navigate } from '@reach/router'
import React, { useCallback } from 'react'
import { useMutation } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import CreateEntityForm from '../../forms/CreateEntityForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { CreateNewGameMutation } from './__generated__/CreateNewGameMutation.graphql'

export default function CreateNewGame() {
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
        })
      })
    },
    [mutate]
  )

  return (
    <MainLayout heading="Create New Game">
      <CreateEntityForm entityType={'game'} onSubmit={handleSubmit} />
    </MainLayout>
  )
}
