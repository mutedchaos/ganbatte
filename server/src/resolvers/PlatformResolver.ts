import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import Platform from '../models/Platform'
import { platformRepository } from '../repositories'
import { Role } from '../services/roles'

@Resolver()
export class PlatformResolver {
  @Authorized(Role.DATA_MANAGER)
  @Mutation(() => Platform)
  async createPlatform(@Arg('name') name: string) {
    const platform = new Platform(name)
    await platformRepository.save(platform)
    return platform
  }

  @Query(() => [Platform])
  async listPlatforms() {
    return await platformRepository.find({ order: { name: 'ASC', id: 'ASC' } })
  }

  @Query(() => Platform)
  async platform(@Arg('platformId') platformId: string) {
    return await platformRepository.findOne(platformId)
  }
}
