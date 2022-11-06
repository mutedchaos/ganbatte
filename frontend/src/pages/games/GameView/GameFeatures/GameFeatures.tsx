import { useCachedData } from '../../../../common/CachedDataProvider'
import ToggableEditable from '../../../../components/misc/TogglableEditable'
import EditGameFeatures from './EditGameFeatures'

export default function GameFeatures() {
  const { game } = useCachedData('game')
  return (
    <ToggableEditable editor={<EditGameFeatures />}>
      <h2>Features</h2>
      {!!game.featuresByType.length && (
        <>
          {[...game.featuresByType]
            .sort((a, b) => a.type.name.localeCompare(b.type.name))
            .map((fbt) => (
              <div key={fbt.type.id}>
                <h2>{fbt.type.name}</h2>
                <ul>
                  {[...fbt.features]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((feat) => (
                      <li key={feat.id}>{feat.name}</li>
                    ))}
                </ul>
              </div>
            ))}
        </>
      )}
    </ToggableEditable>
  )
}
