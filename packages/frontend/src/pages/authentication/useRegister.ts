import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-relay'

import { useRegisterMutation } from './__generated__/useRegisterMutation.graphql'
import type { LoginState } from './LoginPage'

export default function useRegistger(credentials: LoginState) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mutate] = useMutation<useRegisterMutation>(graphql`
    mutation useRegisterMutation($username: String!, $password: String!) {
      createAccount(username: $username, password: $password) {
        success
        errorMessage
      }
    }
  `)

  const register = useCallback(() => {
    setErrorMessage(null)
    mutate({
      variables: credentials,
      onCompleted(result) {
        if (result.createAccount.success) {
          document.location.reload()
        } else {
          setErrorMessage(result.createAccount.errorMessage)
        }
      },
    })
  }, [credentials, mutate])

  return useMemo(
    () => ({
      register,
      errorMessage,
    }),
    [errorMessage, register]
  )
}
