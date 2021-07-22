import { GenreAssociationType } from '../../../pages/genres/GenreView/__generated__/GenreViewQuery.graphql'
import DropdownInput from '../DropdownInput'
import { StringLabeledOption } from '../TypedValueSelect'

interface Props<TField extends string> {
  value: GenreAssociationType | null
  field: TField
  onUpdate(update: { [key in TField]: GenreAssociationType | null }): void
  required?: boolean
}

const options: Array<StringLabeledOption<GenreAssociationType | null>> = [
  {
    label: 'No selection',
    value: null,
  },
  { label: 'Yes / full', value: 'Full' },
  { label: 'Partially', value: 'Partial' },
  { label: 'Expected', value: 'Expected' },
  { label: 'Explicitly not', value: 'ExplicitNo' },
]

export default function GenreAssociationInput<TField extends string>(props: Props<TField>) {
  return <DropdownInput options={options} {...props} />
}
