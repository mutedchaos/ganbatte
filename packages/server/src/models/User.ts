import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Role } from '../services/roles'
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
  @Field()
  public username: string

  @Column()
  public passwordHash: string

  @Column()
  public salt: string

  @OneToMany(() => Review, (review) => review.user)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameOwnership, (ownership) => ownership.user)
  public ownedGames: Promise<GameOwnership[]>

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  public role: Role
}
