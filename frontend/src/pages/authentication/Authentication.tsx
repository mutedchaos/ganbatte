import { graphql } from 'react-relay'
import { useLazyLoadQuery } from 'react-relay'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import { AuthenticationQuery } from './__generated__/AuthenticationQuery.graphql'
import LoginPage from './LoginPage'

export default function Authentication({ children }: ChildrenOnlyProps) {
  const response = useLazyLoadQuery<AuthenticationQuery>(
    graphql`
      query AuthenticationQuery {
        getAuthenticatedUser {
          user {
            username
          }
        }
      }
    `,
    {}
  )

  if (!response.getAuthenticatedUser.user) {
    return <LoginPage />
  } else {
    return <>{children}</>
  }
}
