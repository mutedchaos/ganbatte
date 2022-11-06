import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import FeatureType from './FeatureType'
import GameFeature from './GameFeature'


@ObjectType()
@Entity()
export default class Feature {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Field()
  public name: string

  @Field(() => [GameFeature])
  @OneToMany(() => GameFeature, (gamefeat) => gamefeat.feature)
  public games: Promise<GameFeature[]>

  @Field(() => FeatureType)
  @ManyToOne(() => FeatureType, (feat) => feat.features)
  public type: Promise<FeatureType>
}
