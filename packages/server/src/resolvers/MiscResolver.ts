import { Arg, Directive, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { repositoryByName } from '../repositories'

@ObjectType()
class DeletedIdContainer {
  @Directive('@deleteRecord')
  @Field()
  public id: string

  constructor(id: string) {
    this.id = id
  }
}

@Resolver()
export class MiscResolver {
  @Query(() => Boolean)
  async isNameAvailable(@Arg('name') name: string, @Arg('type') type: 'game') {
    const repository = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    const entity = await repository.findOne({ nameLower: name.toLowerCase() })

    return !entity
  }

  @Mutation(() => DeletedIdContainer)
  async deleteEntity(@Arg('type') type: 'game', @Arg('id') id: string) {
    const repository = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    await repository.delete({ id })

    return new DeletedIdContainer(id)
  }
}
