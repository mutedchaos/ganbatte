import React, { useCallback } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import TypedValueSelect, { StringLabeledOption } from '../../../components/form/TypedValueSelect'
import { GameViewQueryResponse } from './__generated__/GameViewQuery.graphql'
import { OwnershipMutation, OwnershipType } from './__generated__/OwnershipMutation.graphql'

interface Props {
  release: GameViewQueryResponse['game']['releases'][number]
}

const options: Array<StringLabeledOption<OwnershipType>> = [
  { value: 'None', label: "I don't have this" },
  { value: 'Owned', label: 'I own this' },
  { value: 'Access', label: 'I have access to this' },
  { value: 'Wishlisted', label: 'I want this' },
]

export default function Ownership({ release }: Props) {
  const [mutate] = useMutation<OwnershipMutation>(graphql`
    mutation OwnershipMutation($releaseId: String!, $ownershipType: OwnershipType!, $ownershipId: String) {
      updateOwnership(releaseId: $releaseId, ownershipType: $ownershipType, ownershipId: $ownershipId) {
        id
        ownership {
          id
          ownershipType
          isNew
        }
      }
    }
  `)

  const updateOwnership = useCallback(
    (value: OwnershipType) => {
      mutate({
        variables: {
          releaseId: release.id,
          ownershipId: release.ownership.isNew ? null : release.ownership.id,
          ownershipType: value,
        },
      })
    },
    [mutate, release.id, release.ownership.id, release.ownership.isNew]
  )

  return <TypedValueSelect value={release.ownership.ownershipType} options={options} onChange={updateOwnership} />
}
