import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Float,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  registerEnumType,
} from 'type-graphql'

import Feature from '../models/Feature'
import FeatureType from '../models/FeatureType'
import Game from '../models/Game'
import Genre from '../models/Genre'
import Release from '../models/Release'
import Review, { RatingType, reviewRatingSources } from '../models/Review'
import { gameRepository, platformRepository, releaseRepository, reviewRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { AuthorizedGqlContext } from '../services/gqlContext'
import { Role } from '../services/roles'

registerEnumType(RatingType, { name: 'RatingType' })

@InputType()
export class GameUpdate implements Partial<Game> {
  @Field()
  public name?: string

  @Field()
  public sortName?: string
}

@ObjectType()
@InputType()
export class PersonalRating {
  @Field(() => Review, { nullable: true })
  public actual?: Review

  @Field(() => Review, { nullable: true })
  public expected?: Review
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
  async createGame(
    @Arg('name') name: string,
    @Arg('findOnDuplicate', () => Boolean, { nullable: true }) findOnDuplicate?: boolean,
    @Arg('platform', () => String, { nullable: true }) platformId?: string
  ) {
    const game = new Game(name)
    try {
      await gameRepository.save(game)
      const platform = platformId && (await platformRepository.findOne(platformId))
      if (platform) {
        const release = fieldAssign(new Release(), {
          game,
          platform,
        })
        await releaseRepository.save(release)
      }
      return game
    } catch (err) {
      if (err.code === '23505' && findOnDuplicate) {
        const foundGame = gameRepository.findOne({ nameLower: game.nameLower })
        if (!foundGame) throw err
        return foundGame
      }
      throw err
    }
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

  @Authorized()
  @FieldResolver(() => PersonalRating)
  async myRating(@Root() game: Game, @Ctx() context: AuthorizedGqlContext): Promise<PersonalRating> {
    const reviews = await game.reviews
    const myReviews = reviews.filter((r) => r.isPersonal && r.userId === context.user.id)

    return fieldAssign(new PersonalRating(), {
      expected: myReviews.find((r) => r.reviewSource === reviewRatingSources.expected),
      actual: myReviews.find((r) => r.reviewSource === reviewRatingSources.actual),
    })
  }

  @Authorized()
  @Mutation(() => Game)
  async updateGameRating(
    @Arg('gameId') gameId: string,
    @Arg('ratingType', () => RatingType) ratingType: RatingType,
    @Arg('rating', () => Float, { nullable: true }) rating: number | null,
    @Ctx() ctx: AuthorizedGqlContext
  ): Promise<Game> {
    const game = await gameRepository.findOne(gameId)
    if (!game) throw new Error('Invalid game')

    const reviews = await game.reviews
    const source = reviewRatingSources[ratingType]
    const review = reviews.find((r) => r.userId === ctx.user.id && r.reviewSource === source)

    if (typeof rating === 'number') {
      if (review) {
        review.score = rating
        await reviewRepository.save(review)
      } else {
        const newReview = fieldAssign(new Review(), {
          user: Promise.resolve(ctx.user),
          score: rating,
          game: Promise.resolve(game),
          reviewSource: source,
          isPersonal: true,
        })
        await reviewRepository.save(newReview)
      }
    } else {
      if (review) {
        await reviewRepository.delete(review)
      }
      // else: nothing to do
    }

    const refreshedGame = await gameRepository.findOne(gameId)
    if (!refreshedGame) throw new Error('Internal error')
    return refreshedGame
  }
}
