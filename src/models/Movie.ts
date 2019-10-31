import { Column, CreatedAt, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

//No explicit relations defined to level of ORM
@Table
export default class Movie extends Model<Movie> {

  @PrimaryKey
  @Column( { type: DataType.STRING( 40 ) } )
  Id: string;

  @Column( { type: DataType.STRING( 75 ), allowNull: false } )
  Title: string;

  @Column( { type: DataType.INTEGER, allowNull: false } )
  Year: number;

  @CreatedAt
  @Column
  CreatedAt: Date;

}
