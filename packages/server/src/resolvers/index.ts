import { AuthenticationResolver } from './AuthenticationResolver'
import { BusinessEntityRelationshipResolver } from './BusinessEntityRelationshipResolver'
import { BusinessEntityResolver } from './BusinessEntityResolver'
import GameGenreResolver from './GameGenreResolver'
import GameOwnershipResolver from './GameOwnershipResolver'
import { GameResolver } from './GameResolver'
import GenreResolver from './GenreResolver'
import { MiscResolver } from './MiscResolver'
import { PlatformResolver } from './PlatformResolver'
import { ReleaseResolver } from './ReleaseResolver'
import SequelResolver from './SequelResolver'
import SubgenreResolver from './SubgenreResolver'
import { TestResolver } from './TestResolver'

export const resolvers = [
  TestResolver,
  MiscResolver,
  GameResolver,
  PlatformResolver,
  BusinessEntityResolver,
  ReleaseResolver,
  AuthenticationResolver,
  GameOwnershipResolver,
  BusinessEntityRelationshipResolver,
  SequelResolver,
  GenreResolver,
  SubgenreResolver,
  GameGenreResolver,
] as const
