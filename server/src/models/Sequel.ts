import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import Game from './Game'

export enum SequelType {
  DirectSequel = 'directSequel',
  Prequel = 'prequel',
  SpiritualSequel = 'spiritualSequel',
  Remaster = 'remaster',
  Reboot = 'reboot',
}

registerEnumType(SequelType, { name: 'SequelType' })

@ObjectType()
@Entity()
export default class Sequel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Field(() => SequelType)
  @Column({
    type: 'enum',
    enum: SequelType,
  })
  public sequelType: SequelType

  @ManyToOne(() => Game, (game) => game.sequels)
  @Field(() => Game)
  public predecessor: Promise<Game>

  @Field(() => Game)
  @ManyToOne(() => Game, (game) => game.sequelOf)
  public successor: Promise<Game>
}
