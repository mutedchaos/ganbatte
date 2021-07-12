import { Repository, getConnection } from 'typeorm'

import BusinessEntity from './models/BusinessEntity'
import Game from './models/Game'
import GameGenre from './models/GameGenre'
import GameOwnership from './models/GameOwnership'
import Genre from './models/Genre'
import Platform from './models/Platform'
import Release from './models/Release'
import ReleaseRelatedBusinessEntity from './models/ReleaseRelatedBusinessEntity'
import Review from './models/Review'
import Sequel from './models/Sequel'
import Subgenre from './models/Subgenre'
import TestEntity from './models/TestEntity'
import User from './models/User'

type Constructable<T> = {
  new (): T
}

export const testRepository = createRepositoryProxy(TestEntity)
export const gameRepository = createRepositoryProxy(Game)
export const reviewRepository = createRepositoryProxy(Review)
export const sequelRepository = createRepositoryProxy(Sequel)
export const releaseRepository = createRepositoryProxy(Release)
export const userRepository = createRepositoryProxy(User)
export const gameGenreRepository = createRepositoryProxy(GameGenre)
export const genreRepository = createRepositoryProxy(Genre)
export const subgenreRepository = createRepositoryProxy(Subgenre)
export const businessEntityRepository = createRepositoryProxy(BusinessEntity)
export const platformRepository = createRepositoryProxy(Platform)
export const gameOwnershipRepository = createRepositoryProxy(GameOwnership)
export const releaseRelatedBusinessEntityRepository = createRepositoryProxy(ReleaseRelatedBusinessEntity)

export const repositoryByName = {
  test: testRepository,
  game: gameRepository,
  review: reviewRepository,
  sequel: sequelRepository,
  release: releaseRepository,
  user: userRepository,
  gameGenre: gameGenreRepository,
  genre: genreRepository,
  subgenre: subgenreRepository,
  businessEntity: businessEntityRepository,
  platform: platformRepository,
  gameOwnership: gameOwnershipRepository,
  releaseRelatedBusinessEntity: releaseRelatedBusinessEntityRepository,
}

function createRepositoryProxy<T>(entity: Constructable<T>): Repository<T> {
  return (new Proxy<{ repository: null | Repository<T> }>(
    {
      repository: null,
    },
    {
      get(obj, prop) {
        if (!obj.repository) {
          obj.repository = getConnection().getRepository(entity)
        }
        return obj.repository[prop as keyof Repository<T>]
      },
    }
  ) as unknown) as Repository<T>
}
