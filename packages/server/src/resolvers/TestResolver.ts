import { Arg, Query, Resolver } from 'type-graphql'
import TestEntity from '../models/TestEntity'
import { testRepository } from '../repositories'

@Resolver(() => TestEntity)
export class TestResolver {
  @Query(() => TestEntity)
  testEntity(@Arg('id') id: string) {
    return testRepository.findOneOrFail(id)
  }

  @Query(() => TestEntity)
  anotherTestEntity() {
    return Object.assign(new TestEntity(), { id: 'abc' })
  }
}
