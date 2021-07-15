import { sortBy } from 'lodash'
import React, { useCallback } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import OrangeButton from '../../../components/buttons/OrangeButton'
import Editable from '../../../components/misc/Editable'
import { useModal } from '../../../contexts/modal'
import CreateNewReleaseModal from '../../../modals/CreateNewRelease/CreateNewReleaseModal'
import Release from './Release'

export function GameReleases() {
  const { game } = useCachedData('game')

  const modal = useModal()

  const createNewRelease = useCallback(() => {
    modal((props) => <CreateNewReleaseModal {...props} />)
  }, [modal])

  return (
    <>
      <h2>Releases</h2>
      {game.releases.length
        ? sortBy(game.releases, (release) => release.releaseDate).map((release) => (
            <Release key={release.id} release={release} />
          ))
        : 'No releases'}
      <Editable
        editor={
          <div>
            <OrangeButton onClick={createNewRelease}>Create new release</OrangeButton>
          </div>
        }
      />
    </>
  )
}
