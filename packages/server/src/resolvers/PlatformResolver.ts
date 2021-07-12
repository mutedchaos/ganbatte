import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import Platform from '../models/Platform'
import { platformRepository } from '../repositories'

@Resolver()
export class PlatformResolver {
  @Mutation(() => Platform)
  async createPlatform(@Arg('name') name: string) {
    // TODO: authorization
    const platform = new Platform()
    platform.name = name
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
