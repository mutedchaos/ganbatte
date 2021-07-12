import { BusinessEntityResolver } from './BusinessEntityResolver'
import { GameResolver } from './GameResolver'
import { MiscResolver } from './MiscResolver'
import { PlatformResolver } from './PlatformResolver'
import { TestResolver } from './TestResolver'

export const resolvers = [TestResolver, MiscResolver, GameResolver, PlatformResolver, BusinessEntityResolver] as const
