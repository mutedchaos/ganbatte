import { Link } from '@reach/router'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-relay'

import mutateAsPromise from '../../common/mutateAsPromise'
import { SubmitButton } from '../../components/buttons/SubmitButton'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { AddManyGamesMutation } from './__generated__/AddManyGamesMutation.graphql'

export default function AddManyGames() {
  const [names, setNames] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const [mutate] = useMutation<AddManyGamesMutation>(graphql`
    mutation AddManyGamesMutation($name: String!) {
      createGame(name: $name, findOnDuplicate: true) {
        id
        name
      }
    }
  `)

  const updateNames = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatusMessage('')
    setNames(e.target.value.split('\n'))
  }, [])
  const isValid = useMemo(() => names.filter((x) => x.trim()).length > 0, [names])

  const handleSave = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSaving(true)
      let success = 0
      const actualNames = names.map((x) => x.trim()).filter((x) => x)
      const failed: string[] = []
      try {
        for (const name of actualNames) {
          try {
            await mutateAsPromise(mutate, {
              variables: { name },
              updater(store) {
                store.invalidateStore()
              },
            })

            ++success
          } catch (err) {
            failed.push(name)
          }
        }
      } finally {
        setSaving(false)
        setNames(failed)

        if (actualNames.length > success) {
          setStatusMessage(
            'Created or verified ' +
              success +
              ' / ' +
              actualNames.length +
              ' games; those that failed are left in the list.'
          )
        } else {
          setStatusMessage('All games created or ensured they exist.')
        }
      }
    },
    [mutate, names]
  )

  return (
    <MainLayout heading="Add multiple games">
      <form onSubmit={handleSave}>
        <h1>Add multiple games</h1>
        <p>
          Enter names of the games you want to add, one per line. Duplicates and games that already exist are skipped.
        </p>
        <textarea disabled={saving} value={names.join('\n')} cols={120} rows={20} onChange={updateNames} />
        <p>
          <SubmitButton disabled={!isValid || saving}>Create listed games</SubmitButton>
        </p>
        <p>{statusMessage}</p>
      </form>
    </MainLayout>
  )
}
