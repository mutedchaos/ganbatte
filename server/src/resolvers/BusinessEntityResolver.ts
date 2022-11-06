import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import BusinessEntity from '../models/BusinessEntity'
import { businessEntityRepository } from '../repositories'
import { Role } from '../services/roles'

@Resolver()
export class BusinessEntityResolver {
  @Mutation(() => BusinessEntity)
  @Authorized(Role.DATA_MANAGER)
  async createBusinessEntity(@Arg('name') name: string) {
    const businessEntity = new BusinessEntity(name)
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
