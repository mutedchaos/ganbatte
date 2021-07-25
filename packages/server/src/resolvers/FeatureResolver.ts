import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import Feature from '../models/Feature'
import Game from '../models/Game'
import GameFeature from '../models/GameFeature'
import { featureRepository, featureTypeRepository, gameFeatureRepository, gameRepository } from '../repositories'
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
      type: Promise.resolve(featureType),
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
  @Mutation(() => Game)
  @Authorized(Role.DATA_MANAGER)
  async updateFeatureSet(
    @Arg('gameId') gameId: string,
    @Arg('featureTypeId') featureTypeId: string,
    @Arg('featureIds', () => [String]) featureIds: string[]
  ): Promise<Game> {
    const game = await gameRepository.findOne(gameId)
    if (!game) throw new Error('Invalid game')

    const featureType = await featureTypeRepository.findOne(featureTypeId)
    if (!featureType) throw new Error('Invalid feature type')

    const validFeatures = await featureType.features

    if (featureIds.some((featureId) => !validFeatures.some((feat) => feat.id === featureId))) {
      throw new Error('Invalid feature ids')
    }

    const validFeatureIds = validFeatures.map((vf) => vf.id)

    const allGameFeats = await game.features
    const relevantGameFeats = allGameFeats.filter((gf) => validFeatureIds.includes(gf.featureId))

    const toAdd = featureIds.filter((featId) => relevantGameFeats.every((feat) => feat.featureId !== featId))
    const toRemove = relevantGameFeats.filter((gameFeat) => !featureIds.includes(gameFeat.featureId))

    await gameFeatureRepository.remove(toRemove)

    for (const item of toAdd) {
      const feature = validFeatures.find((feat) => feat.id === item)
      if (!feature) throw new Error('Internal error')
      const gameFeat = fieldAssign(new GameFeature(), {
        game: Promise.resolve(game),
        feature: Promise.resolve(feature),
      })

      await gameFeatureRepository.save(gameFeat)
    }
    const freshGame = await gameRepository.findOne(gameId)
    if (!freshGame) throw new Error('Internal error')
    return freshGame
  }
}
