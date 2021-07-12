import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import Game from '../models/Game'
import { gameRepository } from '../repositories'

@Resolver()
export class GameResolver {
  @Mutation(() => Game)
  async createGame(@Arg('name') name: string) {
    // TODO: authorization
    const game = new Game(name)
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
