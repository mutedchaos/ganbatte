import { Arg, Authorized, Ctx, Directive, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { Like, Repository } from 'typeorm'

import User from '../models/User'
import { repositoryByName } from '../repositories'
import { Role } from '../services/roles'

@ObjectType()
class DeletedIdContainer {
  @Directive('@deleteRecord')
  @Field()
  public id: string

  constructor(id: string) {
    this.id = id
  }
}

@ObjectType()
class NameIdPair {
  @Field() public id: string
  @Field() public name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

@ObjectType()
class CurrentUser {
  @Field(() => User, { nullable: true })
  user: User | null
}

type EntityType<T extends Repository<any>> = T extends Repository<infer U> ? U : never

type ValidType = {
  [K in keyof typeof repositoryByName]: EntityType<typeof repositoryByName[K]> extends { nameLower: string } ? K : never
}[keyof typeof repositoryByName]

type Unspecified = { id: string; nameLower: string; name: string }

@Resolver()
export class MiscResolver {
  @Query(() => Boolean)
  async isNameAvailable(@Arg('name') name: string, @Arg('type', () => String) type: ValidType) {
    const repository: Repository<Unspecified> = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    const entity = await repository.findOne({ nameLower: name.toLowerCase() })

    return !entity
  }

  @Query(() => [NameIdPair])
  async getAutocompleteSuggestions(@Arg('query') query: string, @Arg('type', () => String) type: ValidType) {
    const repository: Repository<Unspecified> = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    const entities = await repository.find({ take: 20, where: { nameLower: Like(`${query.toLowerCase()}%`) } })

    return entities.map((e) => new NameIdPair(e.id, e.name))
  }

  @Authorized(Role.DATA_MANAGER)
  @Mutation(() => DeletedIdContainer)
  async deleteEntity(@Arg('type', () => String) type: ValidType, @Arg('id') id: string) {
    const repository: Repository<Unspecified> = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    await repository.delete({ id })

    return new DeletedIdContainer(id)
  }

  @Query(() => CurrentUser)
  async getAuthenticatedUser(@Ctx() context: { user: User | null }) {
    return Object.assign(new CurrentUser(), {
      user: context.user,
    })
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() context: { user: User | null }) {
    return context.user
  }
}
