import { Arg, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql'

import Game from '../models/Game'
import Release from '../models/Release'
import { gameRepository } from '../repositories'

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
/*
  @FieldResolver(() => [Release])
  async releases(@Root() game: Game) {
    return await game.releases
  }*/
}
