import { Arg, Authorized, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql'

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
}
