import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import Release from './Release'

@ObjectType()
@Entity()
export default class Platform {
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

  @OneToMany(() => Release, (release) => release.lazyPlatform)
  public releases: Promise<Release[]>
}
