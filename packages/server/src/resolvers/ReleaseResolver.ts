import { Arg, Authorized, Ctx, Field, FieldResolver, InputType, Mutation, Resolver, Root } from 'type-graphql'
import { v4 as uuid } from 'uuid'

import Game from '../models/Game'
import GameOwnership, { OwnershipType } from '../models/GameOwnership'
import Release from '../models/Release'
import ReleaseRelatedBusinessEntity, { ReleaseEntityRole } from '../models/ReleaseRelatedBusinessEntity'
import {
  gameOwnershipRepository,
  gameRepository,
  platformRepository,
  releaseRelatedBusinessEntityRepository,
  releaseRepository,
} from '../repositories'
import getBusinessEntityPossiblyCreatingOne from '../services/businessEntities/getBusinessEntityPossiblyCreatingOne'
import fieldAssign from '../services/fieldAssign'
import { AuthorizedGqlContext } from '../services/gqlContext'
import { Role } from '../services/roles'

@InputType()
class CreateRelease {
  @Field()
  public gameId: string

  @Field(() => String, { nullable: true })
  public developer: string | null
  @Field(() => String, { nullable: true })
  public publisher: string | null
  @Field(() => [String])
  public platforms: string[]
  @Field()
  public specifier: string
  @Field({ nullable: true })
  public releaseDate: Date
}

@Resolver(() => Release)
export class ReleaseResolver {
  @Authorized(Role.DATA_MANAGER)
  @Mutation(() => Game)
  async createReleases(@Arg('data') data: CreateRelease) {
    const publisher = data.publisher && (await getBusinessEntityPossiblyCreatingOne(data.publisher))
    const developer = data.developer && (await getBusinessEntityPossiblyCreatingOne(data.developer))
    const game = await gameRepository.findOne(data.gameId)
    if (!game) throw new Error('Game not found')

    for (const platformId of data.platforms.length ? data.platforms : [null]) {
      const release = new Release()
      release.game = game
      release.releaseDate = data.releaseDate
      release.specifier = data.specifier
      const platform = platformId && (await platformRepository.findOne(platformId))
      release.platform = platform || null

      await releaseRepository.save(release)

      if (publisher) {
        const pubRef = new ReleaseRelatedBusinessEntity()
        pubRef.release = release
        pubRef.businessEntity = publisher
        pubRef.role = ReleaseEntityRole.Publisher
        pubRef.roleDescription = ''
        await releaseRelatedBusinessEntityRepository.save(pubRef)
      }

      if (developer) {
        const devRef = new ReleaseRelatedBusinessEntity()
        devRef.release = release
        devRef.businessEntity = developer
        devRef.role = ReleaseEntityRole.Developer
        devRef.roleDescription = ''
        await releaseRelatedBusinessEntityRepository.save(devRef)
      }
    }
    return game
  }

  @FieldResolver(() => GameOwnership)
  @Authorized()
  async ownership(@Ctx() context: AuthorizedGqlContext, @Root() release: Release): Promise<GameOwnership> {
    const record = await gameOwnershipRepository.findOne({
      where: {
        user: context.user,
        release: release,
      },
    })
    if (record) return record

    return fieldAssign(new GameOwnership(), {
      id: uuid(),
      user: Promise.resolve(context.user),
      release: Promise.resolve(release),
      ownershipType: OwnershipType.None,
      isNew: true,
    })
  }
}
