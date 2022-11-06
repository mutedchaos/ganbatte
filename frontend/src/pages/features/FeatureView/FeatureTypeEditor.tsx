import { useCallback, useMemo } from 'react'
import { graphql } from 'react-relay'
import { useMutation } from 'react-relay'

import { useCachedData } from '../../../common/CachedDataProvider'
import mutateAsPromise from '../../../common/mutateAsPromise'
import DropdownInput, { ListOption } from '../../../components/form/DropdownInput'
import Labeled from '../../../components/form/Labeled'
import TextInput from '../../../components/form/TextInput'
import { useEditing } from '../../../contexts/ActiveEditingContext'
import { Validateable } from '../../../contexts/Validation'
import { FeatureTypeEditorMutation } from './__generated__/FeatureTypeEditorMutation.graphql'
import { FeaturePickerStyle } from './__generated__/FeatureViewQuery.graphql'

interface State {
  name: string
  editorStyle: FeaturePickerStyle
}

const options: Array<ListOption<FeaturePickerStyle>> = [
  { value: 'Dropdown', label: 'Dropdown' },
  { value: 'Checkboxes', label: 'Checkboxes' },
]

export default function FeatureTypeEditor() {
  const [mutate] = useMutation<FeatureTypeEditorMutation>(graphql`
    mutation FeatureTypeEditorMutation($id: String!, $name: String!, $editorStyle: FeaturePickerStyle!) {
      updateFeatureType(id: $id, name: $name, editorStyle: $editorStyle) {
        id
        name
        editorStyle
      }
    }
  `)

  const { getFeatureType: featureType } = useCachedData('feature')

  const pristine = useMemo<State>(
    () => ({
      name: featureType.name,
      editorStyle: featureType.editorStyle,
    }),
    [featureType.editorStyle, featureType.name]
  )

  const save = useCallback(
    (state: State) => {
      return mutateAsPromise(mutate, {
        variables: {
          ...state,
          id: featureType.id,
        },
      })
    },
    [featureType.id, mutate]
  )
  const { state, updateState, validate } = useEditing(pristine, save)

  return (
    <Validateable onValidate={validate}>
      <Labeled label="Name">
        <TextInput value={state.name} onUpdate={updateState} field="name" />
      </Labeled>
      <Labeled label="Editor style">
        <DropdownInput<'editorStyle', FeaturePickerStyle>
          options={options}
          value={state.editorStyle}
          onUpdate={updateState}
          field="editorStyle"
        />
      </Labeled>
    </Validateable>
  )
}
