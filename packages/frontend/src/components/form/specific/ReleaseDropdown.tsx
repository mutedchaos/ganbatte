import { graphql } from 'babel-plugin-relay/macro'
import React, { useMemo } from 'react'
import { useLazyLoadQuery } from 'react-relay'

import DropdownInput from '../DropdownInput'
import { ReleaseDropdownQuery } from './__generated__/ReleaseDropdownQuery.graphql'

interface CommonProps<TField extends string> {
  field: TField
  gameId: string
  excludeId?: string
}

interface NullableProps<TField extends string> {
  value: string | null
  onUpdate(update: { [key in TField]: string | null }): void
  allowNull: true
}

interface NonNullableProps<TField extends string> {
  value: string
  onUpdate(update: { [key in TField]: string }): void
  allowNull?: false
}

type Props<TField extends string> = CommonProps<TField> & (NullableProps<TField> | NonNullableProps<TField>)

export default function ReleaseDropdown<TField extends string>({
  gameId,
  excludeId,
  allowNull,
  ...rest
}: Props<TField>) {
  const {
    game: { releases },
  } = useLazyLoadQuery<ReleaseDropdownQuery>(
    graphql`
      query ReleaseDropdownQuery($gameId: String!) {
        game(gameId: $gameId) {
          releases {
            id
            platform {
              name
            }
            specifier
          }
        }
      }
    `,
    { gameId }
  )

  const normalOptions = useMemo(() => {
    return releases
      .filter((release) => release.id !== excludeId)
      .map((release) => ({
        value: release.id,
        label: release.specifier ? `${release.platform.name} (${release.specifier})` : release.platform.name,
      }))
  }, [excludeId, releases])

  const options = useMemo(
    () =>
      allowNull
        ? [
            {
              value: null,
              label: 'No selection',
            },
            ...normalOptions,
          ]
        : normalOptions,
    [allowNull, normalOptions]
  )

  return <DropdownInput {...rest} options={options} />
}
