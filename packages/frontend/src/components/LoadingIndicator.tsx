import { useEffect } from 'react'

interface Props {
  onMount?(): void
}

export default function LoadingIndicator({ onMount }: Props) {
  useEffect(() => onMount?.(), [onMount])
  return <span>Loading...</span>
}

export  function BlankLoadingIndicator({ onMount }: Props) {
  useEffect(() => onMount?.(), [onMount])
  return <></>
}
