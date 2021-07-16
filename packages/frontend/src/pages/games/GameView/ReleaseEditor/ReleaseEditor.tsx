import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
import { useLazyLoadQuery } from 'react-relay'
import styled from 'styled-components'

import DateInput from '../../../../components/form/DateInput'
import Labeled from '../../../../components/form/Labeled'
import PlatformDropdown from '../../../../components/form/specific/PlatformDropdown'
import TextInput from '../../../../components/form/TextInput'
import { headings } from '../../../../components/headings'
import { Label } from '../../../../components/misc/Label'
import { useEditing } from '../../../../contexts/ActiveEditingContext'
import { Validateable } from '../../../../contexts/Validation'
import { ReleaseEditorQuery } from './__generated__/ReleaseEditorQuery.graphql'

const Container = styled.div`
  margin: 10px;
  border-left: 4px solid deepskyblue;
  padding-left: 20px;
`

interface Props {
  releaseId: string
}

interface State {
  platformId: string
  specifier: string
  releaseDate: Date | null
}

const Flex = styled.div`
  display: flex;
  > * {
    margin-right: 10px;
    border-left: 1px dotted lightgray;
    padding-left: 10px;
  }
`

export default function ReleaseEditor({ releaseId }: Props) {
  const { getRelease: release } = useLazyLoadQuery<ReleaseEditorQuery>(
    graphql`
      query ReleaseEditorQuery($releaseId: String!) {
        getRelease(id: $releaseId) {
          id
          platform {
            id
          }
          specifier
          releaseDate
          basedOn {
            id
          }
          leadTo {
            id
          }
          businessEntities {
            id
            roleDescription
            role
            businessEntity {
              name
            }
          }
        }
      }
    `,
    { releaseId }
  )

  const pristineState = useMemo<State>(
    () => ({
      platformId: release.platform.id,
      specifier: release.specifier,
      releaseDate: release.releaseDate ? new Date(release.releaseDate) : null,
    }),
    [release.platform.id, release.releaseDate, release.specifier]
  )

  const handleSave = useCallback(async () => {}, [])
  const { state, updateState, validate } = useEditing(pristineState, handleSave)

  return (
    <Container>
      <Validateable onValidate={validate}>
        <headings.BlockHeading>Editing release</headings.BlockHeading>
        <Flex>
          <Labeled label="Platform">
            <PlatformDropdown value={state.platformId} field="platformId" onUpdate={updateState} />
          </Labeled>
          <Labeled label="Release description/specifier">
            <TextInput value={state.specifier} field="specifier" onUpdate={updateState} />
          </Labeled>
        </Flex>
        <Labeled label="Release date">
          <DateInput value={state.releaseDate} field="releaseDate" onUpdate={updateState} />
        </Labeled>
      </Validateable>
    </Container>
  )
}
