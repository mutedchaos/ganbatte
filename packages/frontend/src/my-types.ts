export type NoUndefined<T> = Exclude<T, undefined>
export type DeepNullSimpleValues<T> = {
  [K in keyof T]: T[K] extends object ? DeepNullSimpleValues<T[K]> : T[K] | null
}

export type IdRequired<T extends { id: string | null }> = {
  [K in keyof T]: K extends 'id' ? string : T[K]
}
