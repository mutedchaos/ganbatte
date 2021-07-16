import { AuthenticationResolver } from './AuthenticationResolver'
import { BusinessEntityRelationshipResolver } from './BusinessEntityRelationshipResolver'
import { BusinessEntityResolver } from './BusinessEntityResolver'
import GameOwnershipResolver from './GameOwnershipResolver'
import { GameResolver } from './GameResolver'
import { MiscResolver } from './MiscResolver'
import { PlatformResolver } from './PlatformResolver'
import { ReleaseResolver } from './ReleaseResolver'
import { TestResolver } from './TestResolver'

export const resolvers = [
  TestResolver,
  MiscResolver,
  GameResolver,
  PlatformResolver,
  BusinessEntityResolver,
  ReleaseResolver,
  AuthenticationResolver,
  GameOwnershipResolver,BusinessEntityRelationshipResolver
] as const
