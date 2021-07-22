import { Field, ObjectType } from 'type-graphql'
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Feature from './Feature'
import Game from './Game'

@ObjectType()
@Entity()
export default class GameFeature {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Field(() => Game)
  @ManyToOne(() => Game, (game) => game.features)
  public game: Promise<Game>

  @Field(() => Feature)
  @ManyToOne(() => Feature, (feat) => feat.games)
  public feature: Promise<Feature>
}
