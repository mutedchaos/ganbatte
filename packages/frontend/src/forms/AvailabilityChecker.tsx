import { graphql } from 'babel-plugin-relay/macro'
import React, { Suspense, useCallback, useEffect } from 'react'
import { useLazyLoadQuery } from 'react-relay/hooks'
import { ValidationStatus } from '../common'
import { BlankLoadingIndicator } from '../components/LoadingIndicator'
import { AvailabilityCheckerQuery } from './__generated__/AvailabilityCheckerQuery.graphql'
interface Props {
  name: string
  entityType: string
  onUpdateValidationStatus(status: ValidationStatus): void
}

export default function AvailabilityChecker(props: Props) {
  const { onUpdateValidationStatus } = props
  const triggerLoading = useCallback(() => onUpdateValidationStatus(ValidationStatus.Validating), [
    onUpdateValidationStatus,
  ])
  return (
    <Suspense fallback={<BlankLoadingIndicator onMount={triggerLoading} />}>
      <AvailabilityCheckerImpl {...props} />
    </Suspense>
  )
}

function AvailabilityCheckerImpl({ name, onUpdateValidationStatus, entityType }: Props) {
  const response = useLazyLoadQuery<AvailabilityCheckerQuery>(
    graphql`
      query AvailabilityCheckerQuery($name: String!, $type: String!) {
        isNameAvailable(name: $name, type: $type)
      }
    `,
    { name, type: entityType }
  )

  useEffect(() => {
    const newState = response.isNameAvailable ? ValidationStatus.Valid : ValidationStatus.Invalid
    onUpdateValidationStatus(newState)
  }, [response, onUpdateValidationStatus])

  return <></>
}
