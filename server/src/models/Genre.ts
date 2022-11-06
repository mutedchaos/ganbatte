import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import GameGenre from './GameGenre'
import Subgenre from './Subgenre'

@ObjectType()
@Entity()
export default class Genre {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Index({ unique: true })
  @Field()
  public name: string

  @Column()
  @Index({ unique: true })
  public nameLower: string

  @Field(() => [GameGenre])
  @OneToMany(() => GameGenre, (gg) => gg.genre)
  public games: Promise<GameGenre[]>

  @Field(() => [Subgenre])
  @OneToMany(() => Subgenre, (sg) => sg.parent)
  public subgenres: Promise<Subgenre[]>

  @Field(() => [Subgenre])
  @OneToMany(() => Subgenre, (sg) => sg.child)
  public parents: Promise<Subgenre[]>
}
