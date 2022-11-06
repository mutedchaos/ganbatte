import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Release from './Release'
import User from './User'

export enum OwnershipType {
  None = 'none',
  Owned = 'owned',
  Access = 'access',
  Wishlisted = 'wishlisted',
}

@ObjectType()
@Entity()
export default class GameOwnership {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  public recorded: Date

  @Column()
  @Field(() => OwnershipType)
  public ownershipType: OwnershipType

  @ManyToOne(() => Release, (release) => release.owners)
  public release: Promise<Release>

  @ManyToOne(() => User, (user) => user.ownedGames)
  public user: Promise<User>

  @Field({ nullable: true })
  public isNew?: boolean // true if this is a synthetic one that does not exist in the db
}
