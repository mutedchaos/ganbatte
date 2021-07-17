import { graphql } from 'babel-plugin-relay/macro'
import { fetchQuery } from 'relay-runtime'

import RelayEnvironment from '../RelayEnvironment'
import { getGameIdByNameQuery } from './__generated__/getGameIdByNameQuery.graphql'

export default async function getGameIdByName(name: string | null) {
  const response = await fetchQuery<getGameIdByNameQuery>(
    RelayEnvironment,
    graphql`
      query getGameIdByNameQuery($gameName: String!, $skip: Boolean!) {
        getGameByName(name: $gameName) @skip(if: $skip) {
          id
        }
      }
    `,
    {
      gameName: name ?? '',
      skip: !name,
    }
  ).toPromise()
  return response?.getGameByName?.id
}
