import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import GameOwnership from './GameOwnership'
import Review from './Review'

@ObjectType()
@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Index({ unique: true })
  public username: string

  @Column()
  public passwordHash: string

  @OneToMany(() => Review, (review) => review.user)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameOwnership, (ownership) => ownership.user)
  public ownedGames: Promise<GameOwnership[]>
}
