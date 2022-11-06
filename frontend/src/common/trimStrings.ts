import mapValues from 'lodash/mapValues'

export default function trimStrings<T extends object>(input: T): T {
  return mapValues<T>(input, (value: any) => (typeof value === 'string' ? value.trim() : value)) as any as T
}
