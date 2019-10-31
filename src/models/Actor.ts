import { Model, Column, Table, CreatedAt, DataType, PrimaryKey } from "sequelize-typescript";

//No explicit relations defined to level of ORM
@Table
export default class Actor extends Model<Actor> {

  @PrimaryKey
  @Column( { type: DataType.STRING( 40 ) } )
  Id: string;

  @Column( { type: DataType.STRING( 75 ), allowNull: false } )
  FirstName: string;

  @Column( { type: DataType.STRING( 75 ), allowNull: false } )
  LastName: string;

  @Column( { type: DataType.DATEONLY, allowNull: false } )
  BirthDay: Date;

  @CreatedAt
  @Column
  CreatedAt: Date;

}
