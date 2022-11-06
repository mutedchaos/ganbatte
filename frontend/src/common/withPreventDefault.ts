import React from 'react'

export default function withPreventDefault(inner: () => void) {
  return function (e: React.SyntheticEvent<HTMLElement>) {
    e.preventDefault()
    return inner()
  }
}
