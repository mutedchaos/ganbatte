import TestEntity from './models/TestEntity'
import { getConnection, Repository } from 'typeorm'

type Constructable<T> = {
  new (): T
}

export const testRepository = createRepositoryProxy(TestEntity)

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
