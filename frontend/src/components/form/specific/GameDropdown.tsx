import React, { useCallback, useRef } from 'react'
import { graphql } from 'react-relay'
import { useLazyLoadQuery } from 'react-relay'

import getGameIdByName from '../../../common/getGameIdByName'
import { getVaguelyUniqueId } from '../../../common/useVaguelyUniqueId'
import { GameDropdownQuery } from './__generated__/GameDropdownQuery.graphql'
import AutocompleteInput from './AutocompleteInput'

interface CommonProps<TField extends string> {
  required?: boolean
  field: TField
}
interface NonNullProps<TField extends string> {
  value: string
  onUpdate(update: { [key in TField]: string }): void
}

interface NullProps<TField extends string> {
  value: string | null
  onUpdate(update: { [key in TField]: string | null }): void
}

type Props<TField extends string> = CommonProps<TField> & (NonNullProps<TField> | NullProps<TField>)

export default function GameDropdown<TField extends string>({ value, onUpdate, field }: Props<TField>) {
  const gameName = useLazyLoadQuery<GameDropdownQuery>(
    graphql`
      query GameDropdownQuery($gameId: String!, $skip: Boolean!) {
        game(gameId: $gameId) @skip(if: $skip) {
          id
          name
        }
      }
    `,
    { gameId: value ?? '', skip: !value }
  )

  const latest = useRef<string>()

  const handleUpdate = useCallback(
    async (update: { game: null | string }) => {
      const myId = (latest.current = getVaguelyUniqueId())

      const gameId = await getGameIdByName(update.game)
      if (latest.current === myId) {
        onUpdate({ [field]: gameId } as any)
      }
    },
    [field, onUpdate]
  )

  return (
    <AutocompleteInput
      type={'game'}
      field={'game'}
      value={gameName.game?.name ?? ''}
      onlySuggestedValues
      onUpdate={handleUpdate}
    />
  )
}
