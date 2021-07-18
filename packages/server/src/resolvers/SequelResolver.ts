import { Arg, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import Game from '../models/Game'
import Sequel, { SequelType } from '../models/Sequel'
import { gameRepository, sequelRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'

@ObjectType()
class GameFranchise {
  @Field(() => [Game])
  public games: Game[]

  @Field(() => [Sequel])
  public sequels: Sequel[]
}

@Resolver()
export default class SequelResolver {
  @Mutation(() => [Game])
  async createSequel(
    @Arg('predecessor') predecessorId: string,
    @Arg('successor') successorId: string,
    @Arg('sequelType', () => SequelType) sequelType: SequelType
  ): Promise<Game[]> {
    const predecessor = await gameRepository.findOne(predecessorId)
    if (!predecessor) throw new Error('Predecessor not found')

    const successor = await gameRepository.findOne(successorId)
    if (!successor) throw new Error('Successor not found')

    const sequel = fieldAssign(new Sequel(), {
      predecessor: Promise.resolve(predecessor),
      successor: Promise.resolve(successor),
      sequelType,
    })

    await sequelRepository.save(sequel)

    return [predecessor, successor]
  }

  @Query(() => GameFranchise)
  async gameFranchise(@Arg('gameId') gameId: string) {
    const initialGame = await gameRepository.findOne(gameId)
    if (!initialGame) throw new Error('Game not ofund')
    const workingSet = [initialGame]
    const games = new Map<string, Game>()
    const sequels = new Map<string, Sequel>()

    while (workingSet.length) {
      const game = workingSet.shift()
      if (!game) throw new Error('Internal error')

      if (games.has(game.id)) continue // a loop maybe?
      games.set(game.id, game)
      for (const sequel of [...(await game.sequels), ...(await game.sequelOf)]) {
        if (!sequels.has(sequel.id)) {
          sequels.set(sequel.id, sequel)
          workingSet.push(await sequel.predecessor)
          workingSet.push(await sequel.successor)
        }
      }
    }

    return fieldAssign(new GameFranchise(), { games: [...games.values()], sequels: [...sequels.values()] })
  }
}
