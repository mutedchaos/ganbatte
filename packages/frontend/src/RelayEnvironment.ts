import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime'

import { addGlobalError } from './components/GlobalErrors'

let token = localStorage.getItem('gan-token')

export function forgetToken() {
  token = ''
  localStorage.removeItem('gan-token')
}

const fetchGraphQL = async (text: string | null | undefined, variables: any) => {
  // Fetch data from GitHub's GraphQL API:
  const response = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? 'Bearer ' + token : 'None',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })

  if (response.status === 401) document.location.reload()
  const newToken = response.headers.get('x-new-token')
  if (newToken) {
    token = newToken
    localStorage.setItem('gan-token', newToken)
  }
  // Get the response as JSON
  const json = await response.json()

  if ('errors' in json) {
    for (const error of json.errors) {
      addGlobalError(error)
    }
  }
  return json
}

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
const fetchRelay: FetchFunction = async function fetchRelay(params, variables) {
  console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`)
  return fetchGraphQL(params.text, variables)
}

// Export a singleton instance of Relay Environment configured with our network function:
export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
})
