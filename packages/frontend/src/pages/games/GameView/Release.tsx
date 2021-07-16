import styled from 'styled-components'

import { intepreteDate } from '../../../common/dateUtils'
import TogglableEditable from '../../../components/misc/TogglableEditable'
import { GameViewQueryResponse } from './__generated__/GameViewQuery.graphql'
import Ownership from './Ownership'
import ReleaseEditor from './ReleaseEditor/ReleaseEditor'

interface Props {
  release: GameViewQueryResponse['game']['releases'][number]
}

const Container = styled.div``

export default function Release({ release }: Props) {
  return (
    <TogglableEditable editor={<ReleaseEditor releaseId={release.id} />}>
      <Container>
        {release.specifier ? release.specifier + ' released' : 'Released'} on {release.platform.name}
        {release.releaseDate && 'on ' + intepreteDate(new Date(release.releaseDate)).formatted}
        <Ownership release={release} />
      </Container>
    </TogglableEditable>
  )
}
