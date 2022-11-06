import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { platformRepository, releaseRepository } from '../repositories'
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
  public lazyPlatform: Promise<Platform | null | undefined>

  @Field(() => Platform)
  public get platform() {
    return this.lazyPlatform
  }

  public set platform(newValue: Promise<Platform | null | undefined> | Platform | null | undefined | string) {
    if (typeof newValue === 'string') {
      this.lazyPlatform = platformRepository.findOne(newValue).then((entry) => {
        if (!entry) throw new Error('Release not found')
        return entry
      })
    } else {
      this.lazyPlatform = Promise.resolve(newValue)
    }
  }

  @ManyToOne(() => Release, (release) => release.leadTo)
  @JoinColumn({ name: 'basedOn' })
  public lazyBasedOn: Promise<Release | null | undefined>

  @Field(() => Release, { nullable: true })
  public get basedOn() {
    return this.lazyBasedOn
  }

  public set basedOn(newValue: Promise<Release | null | undefined> | Release | null | undefined | string) {
    if (typeof newValue === 'string') {
      this.lazyBasedOn = releaseRepository.findOne(newValue).then((entry) => {
        if (!entry) throw new Error('Release not found')
        return entry
      })
    } else {
      this.lazyBasedOn = Promise.resolve(newValue)
    }
  }

  @Field(() => [Release])
  @OneToMany(() => Release, (release) => release.lazyBasedOn)
  public leadTo: Promise<Release[]>

  @OneToMany(() => Review, (review) => review.release)
  public reviews: Promise<Review[]>

  @OneToMany(() => GameOwnership, (ownership) => ownership.release)
  public owners: Promise<GameOwnership[]>

  @OneToMany(() => ReleaseRelatedBusinessEntity, (entity) => entity.lazyRelease)
  @Field(() => [ReleaseRelatedBusinessEntity])
  public businessEntities: Promise<ReleaseRelatedBusinessEntity[]>
}
