type Variant = {
  inteprete(date: Date): { type: string; value: string; formatted: string }
  asDate(value: string): Date | null
}

const variants: { [seconds: number]: Variant } = {
  0: {
    inteprete(date) {
      const isoDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
      return { type: 'date', value: isoDate, formatted: isoDate }
    },
    asDate(value) {
      if (!value.match(/^\d{4}-\d\d-\d\d$/)) return null
      return new Date(value + 'T00:00:00.000Z')
    },
  },
  1: {
    inteprete(date) {
      const isoDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`
      return { type: 'month', value: isoDate, formatted: isoDate }
    },
    asDate(value) {
      if (!value.match(/^\d{4}-\d\d$/)) return null
      return new Date(value + '-01T00:00:01.000Z')
    },
  },
  2: {
    inteprete(date) {
      const year = `${date.getUTCFullYear()}`
      return { type: 'year', value: year, formatted: year }
    },
    asDate(value) {
      if (!value.match(/^\d{4}$/)) return null
      return new Date(value + '-01-01T00:00:02.000Z')
    },
  },
  3: {
    inteprete(date) {
      const year = date.getUTCFullYear()
      const quarter = date.getUTCMonth() / 3 + 1
      const value = `${year}-Q${quarter}`

      return { type: 'quarter', value, formatted: value }
    },
    asDate(value) {
      if (!value.match(/^\d{4}-[qQ]\d$/)) return null
      const [year, quarter] = value.split('-')
      const month = (+quarter[1] - 1) * 3 + 1
      const date = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:03.000Z`)
      if (isNaN(date.valueOf())) return null
      return date
    },
  },
}

export function intepreteDate(date: Date | null) {
  if (!date) return { type: 'none', value: '', formatted: '-' }
  const seconds = date.getUTCSeconds()
  if (!(seconds in variants)) throw new Error('Cannot handle date variant ' + seconds)
  return variants[seconds].inteprete(date)
}

export function asDate(value: string): Date | null {
  for (const variant of Object.values(variants)) {
    const candidate = variant.asDate(value)
    if (candidate) return candidate
  }
  return null
}
