import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Game from './Game'
import Genre from './Genre'
import { GenreAssociationType } from './misc/GenreAssociationType'

@ObjectType()
@Entity()
export default class GameGenre {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column({
    type: 'enum',
    enum: GenreAssociationType,
  })
  @Field(() => GenreAssociationType)
  public association: GenreAssociationType

  @Field(() => Game)
  @ManyToOne(() => Game, (game) => game.genres)
  public game: Promise<Game>

  @Field(() => Genre)
  @ManyToOne(() => Genre, (genre) => genre.games)
  public genre: Promise<Genre>
}
