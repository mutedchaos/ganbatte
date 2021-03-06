import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Genre from './Genre'
import { GenreAssociationType } from './misc/GenreAssociationType'

registerEnumType(GenreAssociationType, { name: 'GenreAssociationType' })
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
  @Field(() => GenreAssociationType)
  public association: GenreAssociationType

  @Field(() => Genre)
  @ManyToOne(() => Genre, (genre) => genre.subgenres)
  public parent: Promise<Genre>

  @Field(() => Genre)
  @ManyToOne(() => Genre, (genre) => genre.parents)
  public child: Promise<Genre>
}
