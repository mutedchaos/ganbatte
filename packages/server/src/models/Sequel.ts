import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Game from './Game'

export enum SequelType {
  DirectSequel = 'directSequel',
  Prequel = 'prequel',
  SpiritualSequel = 'spiritualSequel',
  Remaster = 'remaster',
  Reboot = 'reboot',
}

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
  public predecessor: Promise<Game>

  @ManyToOne(() => Game, (game) => game.sequelOf)
  public successor: Promise<Game>
}
