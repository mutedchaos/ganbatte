import React, { ReactNode, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ChildrenOnlyProps } from '../common/ChildrenOnlyProps'
import { getVaguelyUniqueId } from '../common/useVaguelyUniqueId'

interface ControlCtx {
  show(contents: ReactNode): string
  close(id: string): void
}
const controlContext = React.createContext<ControlCtx>(null as any)

const contentContext = React.createContext<ReactNode[]>([])

const ModalArea = styled.div`
  > :first-child + * {
    display: none;
  }
`

interface Child {
  key: string
  node: ReactNode
}

export function ModalProvider({ children }: ChildrenOnlyProps) {
  const [modals, setModals] = useState<Child[]>([])
  const value = useMemo<ControlCtx>(
    () => ({
      show(contents) {
        const key = getVaguelyUniqueId()
        setModals((old) => [{ key, node: <div key={key}>{contents}</div> }, ...old])

        return key
      },
      close(key) {
        setModals((old) => old.filter((x) => x.key !== key))
      },
    }),
    []
  )
  const contentValue = useMemo(() => modals.map((modal) => modal.node), [modals])

  return (
    <controlContext.Provider value={value}>
      <contentContext.Provider value={contentValue}>{children}</contentContext.Provider>
    </controlContext.Provider>
  )
}

export function Modals({ children }: ChildrenOnlyProps) {
  const modals = useContext(contentContext)
  return (
    <ModalArea>
      {modals}
      {children}
    </ModalArea>
  )
}

export interface ModalProps {
  onClose(): void
}

type RenderModalFn = (props: ModalProps) => ReactNode

export function useModal() {
  const ctx = useContext(controlContext)
  return function confirm(renderModal: RenderModalFn) {
    return new Promise<void>((resolve) => {
      const id = ctx.show(renderModal({ onClose: close }))

      function close() {
        ctx.close(id)
        resolve()
      }
    })
  }
}

export function useIsModalActive() {
  return useContext(contentContext).length > 0
}
