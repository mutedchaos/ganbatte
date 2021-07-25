import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Game from './Game'
import Release from './Release'
import User from './User'

export enum RatingType {
  actual = 'actual',
  expected = 'expected',
}

export const reviewRatingSources = {
  [RatingType.actual]: '__personal_rating',
  [RatingType.expected]: '__personal_expectation',
}

@ObjectType()
@Entity()
export default class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Field(() => String)
  @Column()
  public reviewSource: string

  @Field(() => String, { nullable: true })
  @Column({ type: String, nullable: true })
  public reviewUrl: string | null

  @Field(() => Number)
  @Column({ type: 'float' })
  public score: number

  @Field(() => Boolean)
  @Column()
  public isPersonal: boolean

  @Column()
  public userId: string | null

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  @JoinColumn({ name: 'userId' })
  public user: Promise<User | null>

  @ManyToOne(() => Release, (release) => release.reviews, { nullable: true })
  public release: Promise<Release | null>

  @ManyToOne(() => Game, (game) => game.reviews, { nullable: true })
  public game: Promise<Game | null>
}
