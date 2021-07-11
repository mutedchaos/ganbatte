import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { GenreAssociationType } from './misc/GenreAssociationType'
import Genre from './Genre'

@ObjectType()
@Entity()
export default class Subgenre {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column({
    type: 'enum',
    enum: GenreAssociationType,
  })
  public association: GenreAssociationType

  @ManyToOne(() => Genre, (genre) => genre.subgenres)
  public parent: Genre

  @ManyToOne(() => Genre, (genre) => genre.parents)
  public child: Genre
}
