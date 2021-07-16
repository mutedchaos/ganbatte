import styled from 'styled-components'

import { intepreteDate } from '../../../common/dateUtils'
import { GameViewQueryResponse } from './__generated__/GameViewQuery.graphql'
import Ownership from './Ownership'

interface Props {
  release: GameViewQueryResponse['game']['releases'][number]
}

const Container = styled.div``

export default function Release({ release }: Props) {
  return (
    <Container>
      {release.specifier ? release.specifier + ' released' : 'Released'} on {release.platform.name}
      {release.releaseDate && 'on ' + intepreteDate(new Date(release.releaseDate)).formatted}
      <Ownership release={release} />
    </Container>
  )
}
