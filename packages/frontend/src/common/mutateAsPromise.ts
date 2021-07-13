import { UseMutationConfig } from 'react-relay'
import { Disposable, MutationParameters } from 'relay-runtime'

export default function mutateAsPromise<TMutation extends MutationParameters>(
  mutation: (config: UseMutationConfig<TMutation>) => Disposable,
  params: UseMutationConfig<TMutation>
) {
  return new Promise<void>((resolve) => {
    mutation({
      ...params,
      onCompleted(a, b) {
        params.onCompleted?.(a, b)
        resolve()
      },
    })
  })
}
