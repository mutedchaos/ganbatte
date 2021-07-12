import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import BusinessEntity from '../models/BusinessEntity'
import { businessEntityRepository } from '../repositories'

@Resolver()
export class BusinessEntityResolver {
  @Mutation(() => BusinessEntity)
  async createBusinessEntity(@Arg('name') name: string) {
    // TODO: authorization
    const businessEntity = new BusinessEntity()
    businessEntity.name = name
    await businessEntityRepository.save(businessEntity)
    return businessEntity
  }

  @Query(() => [BusinessEntity])
  async listBusinessEntities() {
    return await businessEntityRepository.find({ order: { name: 'ASC', id: 'ASC' } })
  }

  @Query(() => BusinessEntity)
  async businessEntity(@Arg('businessEntityId') businessEntityId: string) {
    return await businessEntityRepository.findOne(businessEntityId)
  }
}
