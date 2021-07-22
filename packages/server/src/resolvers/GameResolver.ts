import {
  Arg,
  Authorized,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import Feature from '../models/Feature'
import FeatureType from '../models/FeatureType'
import Game from '../models/Game'
import Genre from '../models/Genre'
import { gameRepository } from '../repositories'
import { Role } from '../services/roles'

@InputType()
export class GameUpdate implements Partial<Game> {
  @Field()
  public name?: string

  @Field()
  public sortName?: string
}

@ObjectType()
class TypeAndFeatures {
  @Field()
  public type: FeatureType
  @Field(() => [Feature])
  public features: Feature[] = []
}

@Resolver(() => Game)
export class GameResolver {
  @Mutation(() => Game)
  @Authorized(Role.DATA_MANAGER)
  async createGame(@Arg('name') name: string) {
    const game = new Game(name)
    await gameRepository.save(game)
    return game
  }

  @Mutation(() => Game)
  @Authorized(Role.DATA_MANAGER)
  async updateGame(@Arg('id') id: string, @Arg('data') data: GameUpdate) {
    // TODO: authorization
    const game = await gameRepository.findOne(id)
    if (!game) throw new Error('Invalid game')
    Object.assign(game, data)
    game.nameLower = game.name.toLowerCase()
    await gameRepository.save(game)
    return game
  }

  @Query(() => [Game])
  async listGames() {
    return await gameRepository.find({ order: { nameLower: 'ASC', id: 'ASC' } })
  }

  @Query(() => Game)
  async game(@Arg('gameId') gameId: string) {
    return await gameRepository.findOne(gameId)
  }

  @Query(() => Game)
  async getGameByName(@Arg('name') name: string) {
    return await gameRepository.findOne({ name: name })
  }

  @FieldResolver(() => [Genre])
  async relatedGenres(@Root() game: Game): Promise<Genre[]> {
    const output: Genre[] = []

    for (const gameGenre of await game.genres) {
      await handle(await gameGenre.genre)
    }

    async function handle(genre: Genre) {
      if (output.some((o) => o.id === genre.id)) return
      output.push(genre)

      for (const subgenre of await genre.subgenres) {
        await handle(await subgenre.child)
      }
    }

    return output
  }

  @FieldResolver(() => [TypeAndFeatures])
  async featuresByType(@Root() game: Game): Promise<TypeAndFeatures[]> {
    const outputData = new Map<string, TypeAndFeatures>()

    for (const gameFeature of await game.features) {
      const feature = await gameFeature.feature
      const type = await feature.type
      const typeAndFeatures = (function (outputData: Map<string, TypeAndFeatures>, type: FeatureType) {
        const taf1 = outputData.get(type.id)
        if (taf1) return taf1
        const taf2 = new TypeAndFeatures()
        taf2.type = type
        outputData.set(type.id, taf2)
        return taf2
      })(outputData, type)

      typeAndFeatures.features.push(feature)
    }

    return Array.from(outputData.values())
  }
}
