import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import BusinessEntity from './BusinessEntity'
import Release from './Release'

export enum ReleaseEntityRole {
  Developer = 'developer',
  Publisher = 'publisher',
}

registerEnumType(ReleaseEntityRole, { name: 'ReleaseEntityRole' })

@ObjectType()
@Entity()
export default class ReleaseRelatedBusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Field()
  public roleDescription: string

  @Column()
  @Field(() => ReleaseEntityRole)
  public role: ReleaseEntityRole

  @JoinColumn({ name: 'release' })
  @ManyToOne(() => Release, (release) => release.businessEntities, { nullable: false })
  public lazyRelease: Promise<Release>

  public get release() {
    return this.lazyRelease
  }

  public set release(release: Promise<Release> | Release) {
    this.lazyRelease = Promise.resolve(release)
  }
  @JoinColumn({ name: 'businessEntity' })
  @ManyToOne(() => BusinessEntity, (entity) => entity.releases, { nullable: false })
  public lazyBusinessEntity: Promise<BusinessEntity>

  @Field(() => BusinessEntity)
  public get businessEntity() {
    return this.lazyBusinessEntity
  }

  public set businessEntity(businessEntity: Promise<BusinessEntity> | BusinessEntity) {
    this.lazyBusinessEntity = Promise.resolve(businessEntity)
  }
}
