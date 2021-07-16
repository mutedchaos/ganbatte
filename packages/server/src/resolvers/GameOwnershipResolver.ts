import { Arg, Authorized, Ctx, Mutation, Resolver, registerEnumType } from 'type-graphql'

import GameOwnership, { OwnershipType } from '../models/GameOwnership'
import Release from '../models/Release'
import { gameOwnershipRepository, releaseRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { AuthorizedGqlContext } from '../services/gqlContext'

registerEnumType(OwnershipType, { name: 'OwnershipType' })

@Resolver()
export default class GameOwnershipResolver {
  @Mutation(() => Release)
  @Authorized()
  async updateOwnership(
    @Ctx() context: AuthorizedGqlContext,
    @Arg('releaseId') releaseId: string,
    @Arg('ownershipType', () => OwnershipType) ownershipType: OwnershipType,
    @Arg('ownershipId', () => String, { nullable: true }) ownershipId: string | null
  ) {
    let ownership: GameOwnership
    if (ownershipId) {
      const dbOwnership = await gameOwnershipRepository.findOne({
        id: ownershipId,
        user: Promise.resolve(context.user),
      })
      if (!dbOwnership) throw new Error('Invalid ownership')
      ownership = dbOwnership
    } else {
      const release = await releaseRepository.findOne(releaseId)
      if (!release) throw new Error('Release not found')

      ownership = fieldAssign(new GameOwnership(), {
        release: Promise.resolve(release),
        user: Promise.resolve(context.user),
      })
    }

    fieldAssign(ownership, {
      ownershipType: ownershipType,
      recorded: new Date(),
    })

    await gameOwnershipRepository.save(ownership)

    return ownership.release
  }
}
