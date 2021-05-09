import { Arg, Mutation, Resolver } from 'type-graphql'
import Game from '../models/Game'
import { gameRepository } from '../repositories'

@Resolver()
export class GameResolver {
  @Mutation(() => Game)
  async createGame(@Arg('name') name: string) {
    const game = new Game(name)
    await gameRepository.save(game)
    return game
  }
}
