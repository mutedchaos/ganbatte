import { Arg, Mutation, Resolver } from 'type-graphql'

import Game from '../models/Game'
import Sequel, { SequelType } from '../models/Sequel'
import { gameRepository, sequelRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'

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
}
