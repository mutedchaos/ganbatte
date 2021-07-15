import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'

import Game from '../models/Game'
import { gameRepository } from '../repositories'

@InputType()
export class GameUpdate implements Partial<Game> {
  @Field()
  public name?: string

  @Field()
  public sortName?: string
}

@Resolver()
export class GameResolver {
  @Mutation(() => Game)
  async createGame(@Arg('name') name: string) {
    // TODO: authorization
    const game = new Game(name)
    await gameRepository.save(game)
    return game
  }

  @Mutation(() => Game)
  async updateGame(@Arg('id') id: string, @Arg('data') data: GameUpdate) {
    // TODO: authorization
    const game = await gameRepository.findOne(id)
    if (!game) throw new Error('Invalid game')
    Object.assign(game, data)
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
}
