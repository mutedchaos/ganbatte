import { graphql } from 'babel-plugin-relay/macro'
import { useCallback, useMemo } from 'react'
import { useLazyLoadQuery } from 'react-relay'
import styled from 'styled-components'

import DeleteEntityButton from '../../../../common/DeleteEntityButton'
import DateInput from '../../../../components/form/DateInput'
import Labeled from '../../../../components/form/Labeled'
import PlatformDropdown from '../../../../components/form/specific/PlatformDropdown'
import ReleaseDropdown from '../../../../components/form/specific/ReleaseDropdown'
import TextInput from '../../../../components/form/TextInput'
import { headings } from '../../../../components/headings'
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
  basedOn: string | null
}

const Flex = styled.div`
  display: flex;
  > * {
    &:not(:first-child) {
      border-left: 1px dotted lightgray;
      padding-left: 10px;
    }
    margin-right: 10px;
  }
`

export default function ReleaseEditor({ releaseId }: Props) {
  const { getRelease: release } = useLazyLoadQuery<ReleaseEditorQuery>(
    graphql`
      query ReleaseEditorQuery($releaseId: String!) {
        getRelease(id: $releaseId) {
          id
          game {
            id
          }
          platform {
            id
            name
          }
          specifier
          releaseDate
          basedOn {
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
      basedOn: release.basedOn?.id ?? null,
    }),
    [release.basedOn?.id, release.platform.id, release.releaseDate, release.specifier]
  )

  const handleSave = useCallback(async () => {}, [])
  const { state, updateState, validate } = useEditing(pristineState, handleSave)

  return (
    <Container>
      <Validateable onValidate={validate}>
        <DeleteEntityButton
          type="release"
          typeLabel="release"
          id={release.id}
          entityName={release.platform.name + ' ' + release.specifier}
        />
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
        <Labeled label="Based on another release">
          <ReleaseDropdown
            value={state.basedOn}
            field="basedOn"
            onUpdate={updateState}
            excludeId={release.id}
            gameId={release.game.id}
            allowNull
          />
        </Labeled>
      </Validateable>
    </Container>
  )
}
