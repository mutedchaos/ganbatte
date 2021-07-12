import { Arg, Query, Resolver } from 'type-graphql'

import { repositoryByName } from '../repositories'

@Resolver()
export class MiscResolver {
  @Query(() => Boolean)
  async isNameAvailable(@Arg('name') name: string, @Arg('type') type: 'game') {
    const repository = repositoryByName[type]
    if (!repository) throw new Error('Invalid repository')
    const entity = await repository.findOne({ nameLower: name.toLowerCase() })

    return !entity
  }
}
