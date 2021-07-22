import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import Feature from '../models/Feature'
import { featureRepository, featureTypeRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@Resolver()
export default class FeatureResolver {
  @Mutation(() => Feature)
  @Authorized(Role.DATA_MANAGER)
  async createFeature(@Arg('featureTypeId') featureTypeId: string, @Arg('name') name: string): Promise<Feature> {
    const sanitizedName = name.trim()
    const featureType = await featureTypeRepository.findOne(featureTypeId)
    if (!featureType) throw new Error('Invalid feature type')

    const feature = fieldAssign(new Feature(), {
      name: sanitizedName,
      type: featureType,
    })
    await featureRepository.save(feature)

    return feature
  }

  @Mutation(() => Feature)
  @Authorized(Role.DATA_MANAGER)
  async updateFeature(@Arg('featureId') featureId: string, @Arg('name') name: string): Promise<Feature> {
    const sanitizedName = name.trim()
    const feature = await featureRepository.findOne(featureId)
    if (!feature) throw new Error('Invalid feature type')

    fieldAssign(feature, {
      name: sanitizedName,
    })
    await featureRepository.save(feature)

    return feature
  }
}
