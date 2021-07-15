import { graphql } from 'babel-plugin-relay/macro'
import { useCallback } from 'react'
import { useLazyLoadQuery } from 'react-relay'

import OrangeButton from '../../components/buttons/OrangeButton'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { forgetToken } from '../../RelayEnvironment'
import { MeQuery } from './__generated__/MeQuery.graphql'

export default function Me() {
  const data = useLazyLoadQuery<MeQuery>(
    graphql`
      query MeQuery {
        me {
          username
          role
        }
      }
    `,
    {}
  )

  const logout = useCallback(() => {
    forgetToken()
    document.location.reload()
  }, [])

  return (
    <MainLayout heading="Me">
      <h1>Hello, {data.me.username}</h1>
      <p>Your access level is {data.me.role}</p>
      <h2>Actions</h2>
      <OrangeButton onClick={logout}>Log out</OrangeButton>
    </MainLayout>
  )
}
