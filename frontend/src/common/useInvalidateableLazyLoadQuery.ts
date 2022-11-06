import { useCallback, useMemo, useState } from 'react'
import { useLazyLoadQuery, useSubscribeToInvalidationState } from 'react-relay'
import { GraphQLTaggedNode, OperationType, VariablesOf } from 'relay-runtime'

export default function useInvalidateableLazyLoadQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  vars: VariablesOf<TQuery>
) {
  const [fetchKey, setFetchKey] = useState(0)
  const response = useLazyLoadQuery<TQuery>(query, vars, { fetchKey: fetchKey.toString() })

  const idArray = useMemo(() => [getId(response)], [response])
  const invalidate = useCallback(() => setFetchKey((key) => ++key), [])
  useSubscribeToInvalidationState(idArray, invalidate)

  return response
}

function getId(obj: any): string {
  const keys = Object.keys(obj)
  return obj[keys[0]].id
}
