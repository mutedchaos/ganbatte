import { platform } from 'os'

import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import Genre from '../models/Genre'
import { genreRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@Resolver()
export default class GenreResolver {
  @Query(() => Genre)
  async getGenre(@Arg('genreId') genreId: string) {
    const genre = genreRepository.findOne(genreId)
    if (!genre) throw new Error('Genre not found')
    return genre
  }

  @Query(() => [Genre])
  async getGenres(): Promise<Genre[]> {
    return genreRepository.find({ order: { nameLower: 'ASC' } })
  }

  @Authorized(Role.DATA_MANAGER)
  @Mutation(() => Genre)
  async createGenre(@Arg('name') name: string): Promise<Genre> {
    const properName = name.trim()
    const genre = fieldAssign(new Genre(), {
      name: properName,
      nameLower: properName.toLowerCase(),
    })
    await genreRepository.save(genre)
    return genre
  }
}
