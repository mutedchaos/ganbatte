import { Field, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import Feature from './Feature'

export enum FeaturePickerStyle {
  Dropdown = 'Dropdown',
  Checkboxes = 'Checkboxes',
}

registerEnumType(FeaturePickerStyle, { name: 'FeaturePickerStyle' })

@ObjectType()
@Entity()
export default class FeatureType {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  public id: string

  @Column()
  @Index({ unique: true })
  @Field()
  public name: string

  @Column()
  @Index({ unique: true })
  public nameLower: string

  @Field(() => FeaturePickerStyle)
  @Column({
    type: 'enum',
    enum: FeaturePickerStyle,
  })
  public editorStyle: FeaturePickerStyle

  @Field(() => [Feature])
  @OneToMany(() => Feature, (feat) => feat.type)
  public features: Promise<Feature[]>
}
