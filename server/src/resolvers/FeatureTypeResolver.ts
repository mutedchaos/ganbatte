import { Arg, Mutation, Query, Resolver } from 'type-graphql'

import FeatureType, { FeaturePickerStyle } from '../models/FeatureType'
import { featureTypeRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'

@Resolver()
export default class FeatureTypeResolver {
  @Query(() => [FeatureType])
  async getFeatureTypes(): Promise<FeatureType[]> {
    return featureTypeRepository.find({})
  }

  @Query(() => FeatureType)
  async getFeatureType(@Arg('featureId') featureId: string): Promise<FeatureType> {
    const ft = await featureTypeRepository.findOne(featureId)
    if (!ft) throw new Error('Invalid feature type')
    return ft
  }

  @Mutation(() => FeatureType)
  async createFeatureType(@Arg('name') name: string): Promise<FeatureType> {
    const properName = name.trim()
    const featureType = fieldAssign(new FeatureType(), {
      name: properName,
      nameLower: properName.toLowerCase(),
      editorStyle: FeaturePickerStyle.Dropdown,
    })

    await featureTypeRepository.save(featureType)
    return featureType
  }

  @Mutation(() => FeatureType)
  async updateFeatureType(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Arg('editorStyle', () => FeaturePickerStyle) editorStyle: FeaturePickerStyle
  ): Promise<FeatureType> {
    const properName = name.trim()
    const featureType = await featureTypeRepository.findOne(id)
    if (!featureType) throw new Error('Invalid feature type')
    fieldAssign(featureType, {
      name: properName,
      nameLower: properName.toLowerCase(),
      editorStyle,
    })

    await featureTypeRepository.save(featureType)
    return featureType
  }
}
