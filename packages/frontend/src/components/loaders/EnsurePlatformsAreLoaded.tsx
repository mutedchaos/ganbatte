import { graphql } from 'babel-plugin-relay/macro'

import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import EnsureLoaded from '../../common/EnsureLoaded'

export default function EnsurePlatformsAreLoaded({ children }: ChildrenOnlyProps) {
  const query = graphql`
    query EnsurePlatformsAreLoadedQuery {
      listPlatforms {
        id
        name
      }
    }
  `

  return (
    <EnsureLoaded entity={'platforms'} query={query}>
      {children}
    </EnsureLoaded>
  )
}
