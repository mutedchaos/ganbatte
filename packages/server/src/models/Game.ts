import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import GameFeature from './GameFeature'
import GameGenre from './GameGenre'
import Release from './Release'
import Review from './Review'
import Sequel from './Sequel'

@ObjectType()
@Entity()
export default class Game {
  constructor(name?: string) {
    if (name !== undefined) {
      this.name = name
      this.nameLower = name.toLowerCase()
      this.sortName = name.toLowerCase()
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Field(() => String)
  @Column()
  public name: string

  @Index({ unique: true })
  @Column()
  public nameLower: string

  @Field()
  @Column()
  public sortName: string

  @OneToMany(() => Sequel, (sequel) => sequel.predecessor)
  @Field(() => [Sequel])
  public sequels: Promise<Sequel[]>

  @OneToMany(() => Sequel, (sequel) => sequel.successor)
  @Field(() => [Sequel])
  public sequelOf: Promise<Sequel[]>

  @OneToMany(() => Review, (review) => review.game)
  public reviews: Promise<Review[]>

  @Field(() => [GameGenre])
  @OneToMany(() => GameGenre, (genre) => genre.game)
  public genres: Promise<GameGenre[]>

  @Field(() => [Release])
  @OneToMany(() => Release, (release) => release.lazyGame)
  public releases: Promise<Release[]>

  @Field(() => [GameFeature])
  @OneToMany(() => GameFeature, (feat) => feat.game)
  public features: Promise<GameFeature[]>
}
