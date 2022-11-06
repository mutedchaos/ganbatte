import { sortBy } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import required from '../../../common/required'
import { FeaturesQueryResponse } from '../../../pages/features/__generated__/FeaturesQuery.graphql'
import TextButton from '../../buttons/TextButton'
import DropdownInput, { ListOption } from '../DropdownInput'

interface Props<TField extends string> {
  value: Array<string | null>
  field: TField

  onUpdate(update: { [key in TField]: Array<string | null> }): void
  featureType: FeaturesQueryResponse['getFeatureTypes'][number]
}

const Container = styled.div`
  margin: 10px 0;
`

export default function FeatureDropdowns<TField extends string>({
  value,
  onUpdate,
  field,
  featureType,
}: Props<TField>) {
  const addAnother = useCallback(() => {
    onUpdate({ [field]: [...value, null] } as any)
  }, [field, onUpdate, value])
  useEffect(() => {
    if (!value.length) {
      addAnother()
    }
  }, [addAnother, field, onUpdate, value.length])

  const handleUpdate = useCallback(
    (update: { [key: string]: string | null }) => {
      const key = Object.keys(update)[0],
        newValue = update[key]
      const valueCopy = [...value]
      valueCopy[+key] = newValue

      onUpdate({ [field]: valueCopy.filter((value, index) => value !== null || index === valueCopy.length - 1) } as any)
    },
    [field, onUpdate, value]
  )

  const baseOptions = useMemo<Array<ListOption<string | null>>>(
    () =>
      sortBy(
        [
          { value: null, label: 'No selection' },
          ...featureType.features
            .filter((feat) => !value.includes(feat.id))
            .map((feature) => ({
              label: feature.name,
              value: feature.id,
            })),
        ],
        'label'
      ),
    [featureType.features, value]
  )

  return (
    <Container>
      {value.map((id, index) => (
        <DropdownInput
          field={index.toString()}
          value={id}
          key={index}
          onUpdate={handleUpdate}
          options={
            id
              ? [{ value: id, label: required(featureType.features.find((f) => f.id === id)).name }, ...baseOptions]
              : baseOptions
          }
        />
      ))}{' '}
      {value[value.length - 1] !== null && <TextButton onClick={addAnother}>Add another</TextButton>}
    </Container>
  )
}
