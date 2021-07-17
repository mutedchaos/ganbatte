import './autocomplete.css'

import { graphql } from 'babel-plugin-relay/macro'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { useRelayEnvironment } from 'react-relay'
import { fetchQuery } from 'relay-runtime'

import { useValidation } from '../../../contexts/Validation'
import { AutocompleteInputQuery } from './__generated__/AutocompleteInputQuery.graphql'

interface Props<TField extends string> {
  type: 'businessEntity' | 'game'
  value: string | null
  field: TField
  required?: boolean
  onlySuggestedValues?: boolean

  onUpdate(update: { [key in TField]: string | null }): void
}

export default function AutocompleteInput<TField extends string>({
  required,
  value,
  onUpdate,
  field,
  type,
  onlySuggestedValues,
}: Props<TField>) {
  const [effectiveValue, setEffectiveValue] = useState(value)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [lastSuggestions, setLastSuggestions] = useState<string[]>([])
  useEffect(() => {
    setEffectiveValue(value)
  }, [value])

  const handleChange = useCallback(
    (_e: any, { newValue }: { newValue: string }) => {
      setEffectiveValue(newValue)
      if (onlySuggestedValues) {
        if (!suggestions.includes(newValue)) {
          setEffectiveValue(newValue)
          return
        }
      }
      onUpdate({ [field]: newValue || null } as { [key in TField]: string | null })
    },
    [field, onUpdate, onlySuggestedValues, suggestions]
  )

  const relayEnvironment = useRelayEnvironment()

  const updateSuggestions = useCallback(
    ({ value }: { value: string }) => {
      fetchQuery<AutocompleteInputQuery>(
        relayEnvironment,
        graphql`
          query AutocompleteInputQuery($query: String!, $type: String!) {
            getAutocompleteSuggestions(query: $query, type: $type) {
              name
            }
          }
        `,
        { query: value, type }
      )
        .toPromise()
        .then((response) => {
          if (response) {
            setSuggestions(response.getAutocompleteSuggestions.map((s) => s.name))
          }
        })
    },
    [relayEnvironment, type]
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])
  const getSuggestionValue = useCallback((suggestion: string) => {
    return suggestion
  }, [])
  const renderSuggestion = useCallback((suggestion: string) => {
    return <span>{suggestion}</span>
  }, [])

  useEffect(() => {
    if (suggestions.length) setLastSuggestions(suggestions)
  }, [suggestions])

  const isValid =
    (!required || !!value?.trim()) &&
    (!onlySuggestedValues || (!!effectiveValue && lastSuggestions.includes(effectiveValue)))

  useValidation(isValid)

  const inputProps = useMemo(
    () => ({
      value: effectiveValue ?? '',
      onChange: handleChange,
      style: { outline: isValid ? 'none' : '1px solid red' },
    }),
    [effectiveValue, handleChange, isValid]
  )

  return (
    <Autosuggest
      inputProps={inputProps}
      suggestions={suggestions}
      onSuggestionsFetchRequested={updateSuggestions}
      onSuggestionsClearRequested={clearSuggestions}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
    />
  )
}
