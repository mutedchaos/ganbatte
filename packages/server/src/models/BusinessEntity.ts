import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import ReleaseRelatedBusinessEntity from './ReleaseRelatedBusinessEntity'

@ObjectType()
@Entity()
export default class BusinessEntity {
  constructor(name?: string) {
    if (name !== undefined) {
      this.name = name
      this.nameLower = name.toLowerCase()
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Field()
  public name: string

  @Column()
  @Index({ unique: true })
  public nameLower: string

  @OneToMany(() => ReleaseRelatedBusinessEntity, (entity) => entity.lazyBusinessEntity)
  public releases: Promise<ReleaseRelatedBusinessEntity[]>
}
