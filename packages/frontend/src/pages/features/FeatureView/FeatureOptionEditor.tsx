import { useCallback, useState } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import { getVaguelyUniqueId } from '../../../common/useVaguelyUniqueId'
import OrangeButton from '../../../components/buttons/OrangeButton'
import { FeatureViewQueryResponse } from './__generated__/FeatureViewQuery.graphql'
import OptionEditor from './OptionEditor'

type StoredEntry = FeatureViewQueryResponse['getFeatureType']['features'][number]

export type Entry =
  | (StoredEntry & { isNew?: undefined })
  | {
      id: string
      isNew: true
      name: string
    }

export default function FeatureOptionEditor() {
  const feature = useCachedData('feature')
  const [newEntries, setNewEntries] = useState<Entry[]>([])

  const handleDelete = useCallback((id: string) => setNewEntries((old) => old.filter((x) => x.id !== id)), [])

  const createNew = useCallback(() => {
    setNewEntries((old) => [
      ...old,
      {
        id: getVaguelyUniqueId(),
        isNew: true,
        association: null,
        name: '',
      },
    ])
  }, [])

  return (
    <div>
      {[...feature.getFeatureType.features, ...newEntries]
        .filter((x) => x)
        .map((entry) => (
          <OptionEditor
            key={entry.id}
            entry={entry}
            onDelete={handleDelete}
            featureTypeId={feature.getFeatureType.id}
          />
        ))}
      <OrangeButton onClick={createNew}>Create new option</OrangeButton>
    </div>
  )
}
