import { navigate } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback } from 'react'
import { useMutation } from 'react-relay'
import styled from 'styled-components'
import { RedButtonVisual } from '../components/buttons/RedButton'
import FloatRight from '../components/styles/FloatRight'
import { useConfirmationPopup } from '../contexts/useConfirmationPopup'
import CancelledError from './CancelledError'
import { DeleteEntityButtonMutation } from './__generated__/DeleteEntityButtonMutation.graphql'


interface Props {
  type: 'game'
  typeLabel: string
  id: string
  entityName: string
  targetPage: string
}
const Button = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: border-color 150ms linear;
  border-radius: 30px;
  &:hover {
    border: 3px solid pink;
    color: red;
  }
`

export default function DeleteEntityButton({ id, typeLabel, type, entityName, targetPage }: Props) {
  const [mutate] = useMutation<DeleteEntityButtonMutation>(graphql`
    mutation DeleteEntityButtonMutation($type: String!, $id: String!) {
      deleteEntity(id: $id, type: $type) {
        id
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
        mutate({
          variables: { type, id },
          onCompleted() {
            navigate(targetPage)
          },
        })
      },
      (err) => {
        if (!(err instanceof CancelledError)) throw err
      }
    )
  }, [confirm, entityName, id, mutate, targetPage, type, typeLabel])

  return (
    <FloatRight>
      <Button onClick={handleClick}>🗑</Button>
    </FloatRight>
  )
}