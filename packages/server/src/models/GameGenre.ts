import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { GenreAssociationType } from './misc/GenreAssociationType'
import Game from './Game'
import Genre from './Genre'

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
  public association: GenreAssociationType

  @ManyToOne(() => Game, (game) => game.genres)
  public game: Promise<Game>

  @ManyToOne(() => Genre, (genre) => genre.games)
  public genre: Promise<Genre>
}
