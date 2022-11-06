import React, { ReactNode, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import CancelledError from '../common/CancelledError'
import { ChildrenOnlyProps } from '../common/ChildrenOnlyProps'
import { getVaguelyUniqueId } from '../common/useVaguelyUniqueId'
import CancelButton from '../components/buttons/CancelButton'
import { OrangeButtonVisual } from '../components/buttons/OrangeButton'
import { PlainButton } from '../components/buttons/PlainButton'
import ConfirmPopup from '../components/popups/ConfirmPopup'
import Overlay from '../components/popups/Overlay'
import Spacer from '../components/Spacer'

interface Ctx {
  show(contents: ReactNode): string
  close(id: string): void
}
const ButtonArea = styled.div``
const context = React.createContext<Ctx>(null as any)

const PopupSpace = styled.div`
  > :first-child + * {
    display: none;
  }
`

interface Child {
  key: string
  node: ReactNode
}

export function ConfirmationPopupProvider({ children }: ChildrenOnlyProps) {
  const [popups, setPopups] = useState<Child[]>([])
  const value = useMemo<Ctx>(
    () => ({
      show(contents) {
        const key = getVaguelyUniqueId()
        setPopups((old) => [{ key, node: <div key={key}>{contents}</div> }, ...old])

        return key
      },
      close(key) {
        setPopups((old) => old.filter((x) => x.key !== key))
      },
    }),
    []
  )
  return (
    <>
      <PopupSpace>{popups.map((x) => x.node)}</PopupSpace>
      <context.Provider value={value}>{children}</context.Provider>
    </>
  )
}

interface Options {
  confirmButton?: ReactNode
}

export function useConfirmationPopup() {
  const ctx = useContext(context)
  return function confirm(prompt: ReactNode, options: Options = {}) {
    return new Promise<void>((resolve, reject) => {
      const id = ctx.show(
        <>
          <Overlay onClick={cancel} />
          <ConfirmPopup>
            {prompt}
            <ButtonArea>
              <PlainButton
                onClick={() => {
                  close()
                  resolve()
                }}
              >
                {options.confirmButton ?? <OrangeButtonVisual>OK</OrangeButtonVisual>}
              </PlainButton>
              <Spacer width={'30px'} /> <CancelButton onClick={cancel} />
            </ButtonArea>
          </ConfirmPopup>
        </>
      )

      function close() {
        ctx.close(id)
      }

      function cancel() {
        close()
        reject(new CancelledError())
      }
    })
  }
}
