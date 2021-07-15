import React, { useCallback } from 'react'

import { useCachedData } from '../../../common/CachedDataProvider'
import OrangeButton from '../../../components/buttons/OrangeButton'
import Editable from '../../../components/misc/Editable'
import { useModal } from '../../../contexts/modal'
import CreateNewReleaseModal from '../../../modals/CreateNewRelease/CreateNewReleaseModal'

export function GameReleases() {
  const { game } = useCachedData('game')

  const modal = useModal()

  const createNewRelease = useCallback(() => {
    modal((props) => <CreateNewReleaseModal {...props} />)
  }, [modal])

  return (
    <>
      <h2>Releases</h2>
      {game.releases.length ? `${game.releases.length} releases` : 'No releases'}
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
