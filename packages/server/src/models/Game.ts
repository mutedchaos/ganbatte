import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export default class Game {
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
}
