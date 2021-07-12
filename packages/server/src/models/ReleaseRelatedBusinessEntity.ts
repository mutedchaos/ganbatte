import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import BusinessEntity from './BusinessEntity'
import Release from './Release'

enum ReleaseEntityRole {
  Developer = 'developer',
  Publisher = 'publisher',
}

@ObjectType()
@Entity()
export default class ReleaseRelatedBusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  public roleDescription: string

  @Column()
  public role: ReleaseEntityRole

  @ManyToOne(() => Release, (release) => release.businessEntities)
  public release: Promise<Release>

  @ManyToOne(() => BusinessEntity, (entity) => entity.releases)
  public businessEntity: Promise<BusinessEntity>
}
