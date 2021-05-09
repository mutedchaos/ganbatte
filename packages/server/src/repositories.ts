import TestEntity from './models/TestEntity'
import { getConnection, Repository } from 'typeorm'
import Game from './models/Game'

type Constructable<T> = {
  new (): T
}

export const testRepository = createRepositoryProxy(TestEntity)
export const gameRepository = createRepositoryProxy(Game)

export const repositoryByName = {
  test: testRepository,
  game: gameRepository,
}

function createRepositoryProxy<T>(entity: Constructable<T>): Repository<T> {
  /**/
  return new Proxy(
    {
      repository: null as any,
    },
    {
      get(obj, prop) {
        if (!obj.repository) {
          obj.repository = getConnection().getRepository(entity)
        }
        return obj.repository![prop]
      },
    }
  ) as any
}
