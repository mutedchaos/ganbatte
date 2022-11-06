export default function required<T>(obj: T): NonNullable<T> {
  if (obj === undefined || obj === null) throw new Error('Internal error: entity required')
  return obj as any
}
