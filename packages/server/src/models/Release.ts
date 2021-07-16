import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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
  @Field()
  public specifier: string

  @Column({ type: Date, nullable: true })
  @Field(() => Date, { nullable: true })
  public releaseDate: Date | null

  @JoinColumn({ name: 'game' })
  @ManyToOne(() => Game, (game) => game.releases, { nullable: false })
  public lazyGame: Promise<Game>

  @Field(() => Game)
  public get game() {
    return this.lazyGame
  }

  public set game(game: Game | Promise<Game>) {
    this.lazyGame = Promise.resolve(game)
  }

  @JoinColumn({ name: 'platform' })
  @ManyToOne(() => Platform, (platform) => platform.releases)
  public lazyPlatform: Promise<Platform | null>

  @Field(() => Platform)
  public get platform() {
    return this.lazyPlatform
  }

  public set platform(platform: Promise<Platform | null> | Platform | null) {
    this.lazyPlatform = Promise.resolve(platform)
  }

  @ManyToOne(() => Release, (release) => release.leadTo)
  @Field(() => Release, { nullable: true })
  public basedOn: Promise<Release | null>

  @Field(() => [Release])
  @OneToMany(() => Release, (release) => release.basedOn)
  public leadTo: Promise<Release[]>

  @OneToMany(() => Review, (review) => review.release)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameOwnership, (ownership) => ownership.release)
  public owners: Promise<GameOwnership[]>

  @OneToMany(() => ReleaseRelatedBusinessEntity, (entity) => entity.lazyRelease)
  @Field(() => [ReleaseRelatedBusinessEntity])
  public businessEntities: Promise<ReleaseRelatedBusinessEntity[]>
}
