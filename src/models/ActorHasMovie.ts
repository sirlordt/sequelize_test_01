import { Model, Column, Table, PrimaryKey, DataType } from "sequelize-typescript";

//No explicit relations defined to level of ORM
@Table
export default class ActorHasMovie extends Model<ActorHasMovie> {

  @PrimaryKey
  @Column( { type: DataType.STRING( 40 ) } )
  MovieId: string;

  @PrimaryKey
  @Column( { type: DataType.STRING( 40 ) } )
  ActorId: string;

}
