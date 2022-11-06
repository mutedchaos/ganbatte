import User from '../models/User'

export type GqlContext = {
  res: {
    setHeader(name: string, value: string): void
  }
  user: User | null
}

export type AuthorizedGqlContext = {
  res: {
    setHeader(name: string, value: string): void
  }
  user: User
}
