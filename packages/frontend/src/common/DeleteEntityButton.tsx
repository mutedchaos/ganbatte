import { navigate } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback } from 'react'
import { useMutation } from 'react-relay'
import styled from 'styled-components'

import { RedButtonVisual } from '../components/buttons/RedButton'
import FloatRight from '../components/styles/FloatRight'
import { useConfirmationPopup } from '../contexts/useConfirmationPopup'
import { DeleteEntityButtonMutation } from './__generated__/DeleteEntityButtonMutation.graphql'
import CancelledError from './CancelledError'

type Props = {
  typeLabel: string
  entityName: string
  targetPage?: string
  onDelete?(): void
  invalidate?: string
} & (
  | {
      id: string
      type: 'game' | 'release' | 'releaseRelatedBusinessEntity' | 'sequel' | 'subgenre' | 'gamegenre' | 'feature'
    }
  | { id?: undefined; type: 'custom' }
)
const Button = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: border-color 150ms linear, background-color 150ms linear;
  border-radius: 30px;
  &:hover {
    border: 3px solid pink;
    color: red;
    background: #ffeeee;
  }
`

export default function DeleteEntityButton({
  invalidate,
  id,
  typeLabel,
  type,
  entityName,
  targetPage,
  onDelete,
}: Props) {
  const [mutate] = useMutation<DeleteEntityButtonMutation>(graphql`
    mutation DeleteEntityButtonMutation($type: String!, $id: String!) {
      deleteEntity(id: $id, type: $type) {
        entityId @deleteRecord
      }
    }
  `)

  const confirm = useConfirmationPopup()

  const handleClick = useCallback(() => {
    confirm(
      <div>
        <p>
          You are about the delete the {typeLabel} named <strong>{entityName}</strong>
        </p>
        <p>Are you sure you want to delete it?</p>
      </div>,
      {
        confirmButton: <RedButtonVisual>Delete</RedButtonVisual>,
      }
    ).then(
      () => {
        if (type === 'custom' || typeof id !== 'string') {
          return onDelete?.()
        }
        mutate({
          variables: { type, id },
          onCompleted() {
            if (targetPage) {
              navigate(targetPage)
            }
            onDelete?.()
          },
          updater(store) {
            if (invalidate) {
              store.get(invalidate)?.invalidateRecord()
            }
          },
        })
      },
      (err) => {
        if (!(err instanceof CancelledError)) throw err
      }
    )
  }, [confirm, entityName, id, invalidate, mutate, onDelete, targetPage, type, typeLabel])

  return (
    <FloatRight>
      <DeleteEntityButtonVisual onClick={handleClick} />
    </FloatRight>
  )
}

export function DeleteEntityButtonVisual(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props}>🗑</Button>
}
