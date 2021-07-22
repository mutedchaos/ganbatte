import { graphql } from 'babel-plugin-relay/macro'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import EnsureLoaded from '../../common/EnsureLoaded'

export default function EnsureGenresAreLoaded({ children }: ChildrenOnlyProps) {
  const query = graphql`
    query EnsureGenresAreLoadedQuery {
      getGenres {
        id
        name
      }
    }
  `

  return (
    <EnsureLoaded entity={'genres'} query={query} requiredKey='getGenres'>
      {children}
    </EnsureLoaded>
  )
}
