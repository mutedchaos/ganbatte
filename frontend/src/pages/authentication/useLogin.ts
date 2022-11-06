import { useCallback, useMemo, useState } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import { useLoginMutation } from './__generated__/useLoginMutation.graphql'
import type { LoginState } from './LoginPage'

export default function useLogin(credentials: LoginState) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mutate] = useMutation<useLoginMutation>(graphql`
    mutation useLoginMutation($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        success
        errorMessage
      }
    }
  `)

  const login = useCallback(() => {
    setErrorMessage(null)
    mutate({
      variables: credentials,
      onCompleted(result) {
        if (result.login.success) {
          document.location.reload()
        } else {
          setErrorMessage(result.login.errorMessage)
        }
      },
    })
  }, [credentials, mutate])

  return useMemo(
    () => ({
      login,
      errorMessage,
    }),
    [errorMessage, login]
  )
}
