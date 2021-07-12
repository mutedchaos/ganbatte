import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import GameGenre from './GameGenre'
import Review from './Review'
import Sequel from './Sequel'

@ObjectType()
@Entity()
export default class Game {
  constructor(name?: string) {
    if (name !== undefined) {
      this.name = name
      this.nameLower = name.toLowerCase()
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Field(() => String)
  @Column()
  public name: string

  @Field(() => String)
  @Index({ unique: true })
  @Column()
  public nameLower: string

  @OneToMany(() => Sequel, (sequel) => sequel.predecessor)
  public sequels: Promise<Sequel[]>

  @OneToMany(() => Sequel, (sequel) => sequel.successor)
  public sequelOf: Promise<Sequel[]>

  @OneToMany(() => Review, (review) => review.game)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameGenre, (genre) => genre.game)
  public genres: Promise<GameGenre[]>
}
