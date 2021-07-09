import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Release from './Release'

@ObjectType()
@Entity()
export default class Platform {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Index({ unique: true })
  public name: string

  @OneToMany(() => Release, (release) => release.platform)
  public releases: Promise<Release[]>
}
