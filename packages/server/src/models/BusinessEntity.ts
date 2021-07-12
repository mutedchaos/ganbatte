import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import ReleaseRelatedBusinessEntity from './ReleaseRelatedBusinessEntity'

@ObjectType()
@Entity()
export default class BusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Index({ unique: true })
  @Field()
  public name: string

  @OneToMany(() => ReleaseRelatedBusinessEntity, (entity) => entity.businessEntity)
  public releases: Promise<ReleaseRelatedBusinessEntity[]>
}
