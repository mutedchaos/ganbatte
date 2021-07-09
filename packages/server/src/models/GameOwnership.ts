import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Release from './Release'
import User from './User'

@ObjectType()
@Entity()
export default class GameOwnership {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  public acquisitionDate: Date

  @Column()
  public recorded: Date

  @ManyToOne(() => Release, (release) => release.owners)
  public release: Promise<Release>

  @ManyToOne(() => User, (user) => user.ownedGames)
  public user: Promise<User>
}
