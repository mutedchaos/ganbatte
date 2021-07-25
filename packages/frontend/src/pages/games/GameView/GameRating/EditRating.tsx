import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-relay'
import styled from 'styled-components'

import { useCachedData } from '../../../../common/CachedDataProvider'
import { DeleteEntityButtonVisual } from '../../../../common/DeleteEntityButton'
import mutateAsPromise from '../../../../common/mutateAsPromise'
import DropdownInput, { ListOption } from '../../../../components/form/DropdownInput'
import { Flex } from '../../../../components/styles/Flex'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { EditRatingMutation } from './__generated__/EditRatingMutation.graphql'
import ScoreView, { ScoreViewWidth } from './ScoreView'

type RatingType = 'actual' | 'expected'

interface State {
  ratingType: RatingType
  rating: number | null
}

const options: Array<ListOption<RatingType>> = [
  {
    value: 'expected',
    label: 'Expected',
  },
  { value: 'actual', label: 'Actual' },
]

const Adjuster = styled.div`
  cursor: pointer;
  user-select: none;
`

const Warning = styled.p`
  color: red;
`

export default function EditRating() {
  const [mutate] = useMutation<EditRatingMutation>(graphql`
    mutation EditRatingMutation($gameId: String!, $ratingType: RatingType!, $rating: Float) {
      updateGameRating(gameId: $gameId, ratingType: $ratingType, rating: $rating) {
        id
        myRating {
          expected {
            id
            score
          }
          actual {
            id
            score
          }
        }
      }
    }
  `)

  const {
    game: {
      id: gameId,
      myRating: { actual: actualReview, expected: expectedReview },
    },
  } = useCachedData('game')

  const actual = actualReview?.score ?? null
  const expected = expectedReview?.score ?? null

  const pristine = useMemo<State>(
    () => ({
      ratingType: expected !== null && actual === null ? 'expected' : 'actual',
      rating: actual ?? expected,
    }),
    [actual, expected]
  )

  const handleSave = useCallback(
    async (state: State) => {
      if (state.rating === null) {
        if (actual !== null) {
          await mutateAsPromise(mutate, {
            variables: {
              gameId,
              ratingType: 'actual',
              rating: null,
            },
          })
        }
        await mutateAsPromise(mutate, { variables: { gameId, ratingType: 'expected', rating: null } })
      } else {
        await mutateAsPromise(mutate, { variables: { gameId, ratingType: state.ratingType, rating: state.rating } })

        if (state.ratingType !== 'actual' && actual !== null) {
          await mutateAsPromise(mutate, { variables: { gameId, ratingType: 'actual', rating: null } })
        }
      }
    },
    [actual, gameId, mutate]
  )

  const adjusterRef = React.useRef<HTMLDivElement>(null)

  const { state, updateState } = useEditing(pristine, handleSave)
  const [fakeRating, setFakeRating] = useState<number | null>(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [deleteNotification, setDeleteNotification] = useState(false)

  const handleMouseLeave = useCallback(() => {
    setFakeRating(null)
  }, [])
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!adjusterRef.current) return
      const x = e.clientX - adjusterRef.current.getBoundingClientRect().left
      const value = (x / ScoreViewWidth) * 5

      const boundedValue = Math.min(Math.max(value, 0), 5)
      setFakeRating(boundedValue)
      if (mouseDown) {
        updateState({ rating: boundedValue })
      }
    },
    [mouseDown, updateState]
  )

  const handleMouseDown = useCallback(() => {
    updateState({ rating: fakeRating })
    setMouseDown(true)
  }, [fakeRating, updateState])
  const handleMouseUp = useCallback(() => {
    setMouseDown(false)
  }, [])

  const handleDelete = useCallback(() => {
    setDeleteNotification(true)
    updateState({ rating: null })
  }, [updateState])

  return (
    <>
      <h2>Rating</h2>
      <Flex>
        <DropdownInput<'ratingType', RatingType>
          field="ratingType"
          value={state.ratingType}
          options={options}
          onUpdate={updateState}
        />
        <DeleteEntityButtonVisual onClick={handleDelete} />
      </Flex>
      <Adjuster
        ref={adjusterRef}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <ScoreView score={fakeRating ?? state.rating ?? 0} faded={state.ratingType === 'expected'} />
      </Adjuster>
      {deleteNotification && state.rating === null && (
        <Warning>The rating will be deleted if you save without setting a new rating first.</Warning>
      )}
    </>
  )
}
