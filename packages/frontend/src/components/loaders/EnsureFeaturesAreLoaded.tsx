import { ChildrenOnlyProps } from '../../common/ChildrenOnlyProps'
import EnsureLoaded from '../../common/EnsureLoaded'
import { featuresQuery } from '../../pages/features/Features'

export default function EnsureFeaturesAreLoaded({ children }: ChildrenOnlyProps) {
  return (
    <EnsureLoaded entity={'features'} query={featuresQuery}>
      {children}
    </EnsureLoaded>
  )
}
