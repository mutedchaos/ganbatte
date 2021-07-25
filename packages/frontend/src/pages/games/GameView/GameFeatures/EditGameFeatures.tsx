import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCachedData } from '../../../../common/CachedDataProvider'
import required from '../../../../common/required'
import OrangeButton from '../../../../components/buttons/OrangeButton'
import EnsureFeaturesAreLoaded from '../../../../components/loaders/EnsureFeaturesAreLoaded'
import { GameViewQueryResponse } from '../__generated__/GameViewQuery.graphql'
import AddNewFeatureType from './AddNewFeatureType'
import GameFeatureTypeEditor from './GameFeatureTypeEditor'



export type Entry = GameViewQueryResponse['game']['featuresByType'][number] & { isNew?: boolean }

export default function EditGameFeatures() {
  return (
    <EnsureFeaturesAreLoaded>
      <EditGameFeaturesImpl />
    </EnsureFeaturesAreLoaded>
  )
}

function EditGameFeaturesImpl() {
  const { game } = useCachedData('game')
  const { getFeatureTypes: featureTypes } = useCachedData('features')

  const [addingNew, setAddingNew] = useState(false)
  const [newFeatures, setNewFeatures] = useState<Entry[]>([])

  const handleDelete = useCallback(
    (key: string) => setNewFeatures((old) => old.filter((entry) => entry.type.id !== key)),
    []
  )

  const { startCreating, stopCreating } = useMemo(
    () => ({
      startCreating() {
        setAddingNew(true)
      },
      stopCreating() {
        setAddingNew(false)
      },
    }),
    []
  )

  const create = useCallback(
    (id: string) => {
      const type = required(featureTypes.find((ft) => ft.id === id))
      setNewFeatures((old) => [
        ...old,
        {
          type,
          features: [],
          isNew: true,
        },
      ])
      setAddingNew(false)
    },
    [featureTypes]
  )

  const excludedFromNew = useMemo(() => [...game.featuresByType, ...newFeatures].map((f) => f.type.id), [
    game.featuresByType,
    newFeatures,
  ])

  useEffect(() => {
    const duplicate = newFeatures.find((nf) => game.featuresByType.some((fbt) => fbt.type.id === nf.type.id))

    if (duplicate) {
      setNewFeatures((old) => old.filter((entry) => entry !== duplicate))
    }
  }, [game.featuresByType, newFeatures])

  return (
    <>
      <h2>Features</h2>
      {[...game.featuresByType, ...newFeatures].map((entry) => (
        <GameFeatureTypeEditor
          key={entry.type.id}
          entry={entry}
          onDelete={handleDelete}
          gameId={game.id}
          featureType={required(featureTypes.find((ft) => ft.id === entry.type.id))}
        />
      ))}
      {addingNew ? (
        <AddNewFeatureType onCancel={stopCreating} excludedIds={excludedFromNew} onAdd={create} />
      ) : (
        <OrangeButton onClick={startCreating}>Add features of a new type</OrangeButton>
      )}
    </>
  )
}
