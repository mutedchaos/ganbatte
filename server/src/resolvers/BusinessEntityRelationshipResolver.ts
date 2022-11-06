import { Arg, Authorized, Field, InputType, Mutation, Resolver } from 'type-graphql'

import Release from '../models/Release'
import ReleaseRelatedBusinessEntity, { ReleaseEntityRole } from '../models/ReleaseRelatedBusinessEntity'
import { releaseRelatedBusinessEntityRepository, releaseRepository } from '../repositories'
import getBusinessEntityPossiblyCreatingOne from '../services/businessEntities/getBusinessEntityPossiblyCreatingOne'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@InputType()
class BusinessEntityRelationData {
  @Field(() => ReleaseEntityRole)
  public role: ReleaseEntityRole

  @Field()
  public businessEntity: string

  @Field()
  public roleDescription: string
}

@Resolver()
export class BusinessEntityRelationshipResolver {
  @Mutation(() => Release)
  @Authorized(Role.DATA_MANAGER)
  async createBusinessEntityRelation(
    @Arg('releaseId') releaseId: string,
    @Arg('data') data: BusinessEntityRelationData
  ) {
    const release = await releaseRepository.findOne(releaseId)
    if (!release) throw new Error('Invalid release')
    const entity = fieldAssign(new ReleaseRelatedBusinessEntity(), {
      release,
      role: data.role,
      roleDescription: data.roleDescription,
      businessEntity: await getBusinessEntityPossiblyCreatingOne(data.businessEntity),
    })

    await releaseRelatedBusinessEntityRepository.save(entity)

    return release
  }

  @Mutation(() => ReleaseRelatedBusinessEntity)
  @Authorized(Role.DATA_MANAGER)
  async updateBusinessEntityRelation(@Arg('id') id: string, @Arg('data') data: BusinessEntityRelationData) {
    const entity = await releaseRelatedBusinessEntityRepository.findOne(id)
    if (!entity) throw new Error('Invalid entity')
    fieldAssign(entity, {
      role: data.role,
      roleDescription: data.roleDescription,
      businessEntity: await getBusinessEntityPossiblyCreatingOne(data.businessEntity),
    })

    await releaseRelatedBusinessEntityRepository.save(entity)

    return entity
  }
}
