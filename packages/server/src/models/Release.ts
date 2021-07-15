import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import Game from './Game'
import GameOwnership from './GameOwnership'
import Platform from './Platform'
import ReleaseRelatedBusinessEntity from './ReleaseRelatedBusinessEntity'
import Review from './Review'

@ObjectType()
@Entity()
export default class Release {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  public specifier: string

  @Column()
  public releaseDate: Date

  @Column()
  public isSelfPublished: boolean

  @ManyToOne(() => Game, (game) => game.releases)
  public game: Promise<Game>

  @ManyToOne(() => Platform, (platform) => platform.releases)
  public platform: Promise<Platform>

  @ManyToOne(() => Release, (release) => release.leadTo)
  public basedOn: Promise<Release | null>

  @OneToMany(() => Release, (release) => release.basedOn)
  public leadTo: Promise<Release[]>

  @OneToMany(() => Review, (review) => review.release)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameOwnership, (ownership) => ownership.release)
  public owners: Promise<GameOwnership[]>

  @OneToMany(() => ReleaseRelatedBusinessEntity, (entity) => entity.release)
  public businessEntities: Promise<ReleaseRelatedBusinessEntity[]>
}
