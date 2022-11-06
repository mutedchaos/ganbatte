import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import GameGenre from '../models/GameGenre'
import { GenreAssociationType } from '../models/misc/GenreAssociationType'
import { gameGenreRepository, gameRepository, genreRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@Resolver()
export default class GameGenreResolver {
  @Mutation(() => GameGenre)
  @Authorized(Role.DATA_MANAGER)
  async addGameGenre(
    @Arg('gameId') gameId: string,
    @Arg('genreId') genreId: string,
    @Arg('association', () => GenreAssociationType) association: GenreAssociationType
  ): Promise<GameGenre> {
    const game = await gameRepository.findOne(gameId)
    const genre = await genreRepository.findOne(genreId)
    if (!game) throw new Error('Game not found')
    if (!genre) throw new Error('Genre not found')

    const gameGenre = fieldAssign(new GameGenre(), {
      association,
      game: Promise.resolve(game),
      genre: Promise.resolve(genre),
    })

    await gameGenreRepository.save(gameGenre)

    return gameGenre
  }

  @Mutation(() => GameGenre)
  @Authorized(Role.DATA_MANAGER)
  async updateGameGenre(
    @Arg('id') id: string,
    @Arg('genreId') genreId: string,
    @Arg('association', () => GenreAssociationType) association: GenreAssociationType
  ): Promise<GameGenre> {
    const gameGenre = await gameGenreRepository.findOne(id)
    const genre = await genreRepository.findOne(genreId)
    if (!gameGenre) throw new Error('Game genre not found')
    if (!genre) throw new Error('Genre not found')

    fieldAssign(gameGenre, {
      association,
      genre: Promise.resolve(genre),
    })

    await gameGenreRepository.save(gameGenre)

    return gameGenre
  }
}
