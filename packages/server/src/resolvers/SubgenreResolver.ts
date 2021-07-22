import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import { GenreAssociationType } from '../models/misc/GenreAssociationType'
import Subgenre from '../models/Subgenre'
import { genreRepository, subgenreRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@Resolver()
export default class SubgenreResolver {
  @Mutation(() => Subgenre)
  @Authorized(Role.DATA_MANAGER)
  async createSubgenre(
    @Arg('parentId') parentId: string,
    @Arg('childId') childId: string,
    @Arg('association', () => GenreAssociationType) association: GenreAssociationType
  ): Promise<Subgenre> {
    const parent = await genreRepository.findOne(parentId)
    const child = await genreRepository.findOne(childId)
    if (!parent) throw new Error('Parent not found')
    if (!child) throw new Error('Child not found')

    const subgenre = fieldAssign(new Subgenre(), {
      association,
      parent: Promise.resolve(parent),
      child: Promise.resolve(child),
    })

    await subgenreRepository.save(subgenre)

    return subgenre
  }

  @Mutation(() => Subgenre)
  @Authorized(Role.DATA_MANAGER)
  async updateSubgenre(
    @Arg('id') id: string,
    @Arg('childId') childId: string,
    @Arg('association', () => GenreAssociationType) association: GenreAssociationType
  ): Promise<Subgenre> {
    const subgenre = await subgenreRepository.findOne(id)
    const child = await genreRepository.findOne(childId)
    if (!subgenre) throw new Error('Subgenre not found')
    if (!child) throw new Error('Child not found')

    fieldAssign(subgenre, {
      association,
      child: Promise.resolve(child),
    })

    await subgenreRepository.save(subgenre)

    return subgenre
  }
}
