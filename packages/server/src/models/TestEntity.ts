import { Field, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export default class TestEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string
}
