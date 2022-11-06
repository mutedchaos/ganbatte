import { useEffect } from 'react'

interface Props {
  onMount?(): void
  className?: string
}

export default function LoadingIndicator({ onMount, className }: Props) {
  useEffect(() => onMount?.(), [onMount])
  return <span className={className}>Loading...</span>
}

export function BlankLoadingIndicator({ onMount }: Props) {
  useEffect(() => onMount?.(), [onMount])
  return <></>
}
