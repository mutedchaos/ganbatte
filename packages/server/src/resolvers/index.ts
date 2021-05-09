import { GameResolver } from './GameResolver'
import { MiscResolver } from './MiscResolver'
import { TestResolver } from './TestResolver'

export const resolvers = [TestResolver, MiscResolver, GameResolver] as const
