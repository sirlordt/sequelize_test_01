import { Sequelize } from 'sequelize-typescript';  //Typescript sequelize plugin
import OriginalSequelize from 'sequelize'; //Original sequelize

import delay from 'delay';

import Actor from './models/Actor';
import Movie from './models/Movie';
import ActorHasMovie from './models/ActorHasMovie';

import config from '../config.json';

//CREATE SCHEMA `TestDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
async function connectToDatabase( strKind: string ): Promise<any> {

  let result = null;

  try {

    const dbConfig = config[ strKind ];

    dbConfig.models = [

      __dirname + '/models/'

    ]

    dbConfig.define = {

      freezeTableName: true,
      timestamps: false,

    }

    dbConfig.logging = ( param01: any, param02: any ) => {

      //console.log( param01 );
      //console.log( param02 );

    }

    result = new Sequelize(

      dbConfig[ 'database' ],
      dbConfig[ 'username' ],
      dbConfig[ 'password' ],
      dbConfig,

    )

    await result.sync( { force: true } ); //Destroy tables and data

  }
  catch ( ex ) {

    console.log( ex );

  }

  return result;

}

async function insertDataToDB( dbConnection: any ) {

  try {

    const actorsData = [

      {
        Id: "83b09645-f938-4e4c-ad4a-287e459e623d",
        FirstName: "Tomas R",
        LastName: "Moreno P",
        BirthDay: "1985-06-15"
      },
      {
        Id: "db94705b-212e-4984-ab57-22c058affb22",
        FirstName: "Andres M",
        LastName: "Gonzalez R",
        BirthDay: "1991-11-04"
      },
      {
        Id: "415a1c3f-17ce-4141-8c2c-092df747f6b6",
        FirstName: "Jose R",
        LastName: "Rodriguez R",
        BirthDay: "1987-10-11"
      }

    ]

    await Actor.bulkCreate( actorsData );

    const moviesData = [

      {
        Id: "f24dbaeb-dc4f-445e-aceb-74a7e3f1fffe",
        Title: "Move 01",
        Year: 1995,
      },
      {
        Id: "c74088bf-4007-46db-8417-471115e1975d",
        Title: "Move 02",
        Year: 1995,
      },
      {
        Id: "38123558-d3c8-4953-b692-bf376b97fd22",
        Title: "Move 03",
        Year: 1995,
      }

    ]

    await Movie.bulkCreate( moviesData );

    const actorHasMovieData = [

      {
        ActorId: "83b09645-f938-4e4c-ad4a-287e459e623d", //Tomas R Moreno P
        MovieId: "f24dbaeb-dc4f-445e-aceb-74a7e3f1fffe", //Movie 01
      },
      {
        ActorId: "db94705b-212e-4984-ab57-22c058affb22", //Andres M Gonzalez R
        MovieId: "c74088bf-4007-46db-8417-471115e1975d", //Movie 02
      },
      {
        ActorId: "415a1c3f-17ce-4141-8c2c-092df747f6b6", //Jose R Rodriguez R
        MovieId: "38123558-d3c8-4953-b692-bf376b97fd22", //Movie 03
      }

    ]

    await ActorHasMovie.bulkCreate( actorHasMovieData );

  }
  catch ( ex ) {

    console.log( ex );

  }

}

async function selectInnerJoin( dbConnection: any ) {

  try {

    const rows = await dbConnection.query( "Select A.*, C.* From Actor As A Inner Join ActorHasMovie As B On B.ActorId = A.Id Inner Join Movie As C On C.Id = B.MovieId", {
      raw: true,
      type: OriginalSequelize.QueryTypes.SELECT,
      //model: [ Actor, Movie ], //<--- 2 Models is not supported, only one model is supported, according to the sequelize doc
      //mapToModel: true  //<--- This option not work with 2 models, only one model is supported, according to the sequelize doc
    } );

    console.log( rows );

    /* OUTPUT

      [
        {
          Id: '38123558-d3c8-4953-b692-bf376b97fd22',  //<--- This value is from the Movie.Id, The value from Actor.Id is lost, because both field are the same name.
          FirstName: 'Jose R',
          LastName: 'Rodriguez R',
          BirthDay: '1987-10-11',
          CreatedAt: 2019-10-31T20:37:24.000Z, //<-- The same field name in both tables, causing the lost of information in the query result
          updatedAt: 2019-10-31T20:37:24.000Z, //<-- The same field name in both tables, causing the lost of information in the query result
          Title: 'Move 03',
          Year: 1995
        },
        {
          Id: 'c74088bf-4007-46db-8417-471115e1975d', //<--- This value is from the Movie.Id, The value from Actor.Id is lost, because both field are the same name.
          FirstName: 'Andres M',
          LastName: 'Gonzalez R',
          BirthDay: '1991-11-04',
          CreatedAt: 2019-10-31T20:37:24.000Z, //<-- The same field name in both tables, causing the lost of information in the query result
          updatedAt: 2019-10-31T20:37:24.000Z, //<-- The same field name in both tables, causing the lost of information in the query result
          Title: 'Move 02',
          Year: 1995
        },
        {
          Id: 'f24dbaeb-dc4f-445e-aceb-74a7e3f1fffe', //<--- This value is from the Movie.Id, The value from Actor.Id is lost, because both field are the same name.
          FirstName: 'Tomas R',
          LastName: 'Moreno P',
          BirthDay: '1985-06-15',
          CreatedAt: 2019-10-31T20:37:24.000Z,  //<-- The same field name in both tables, causing the lost of information in the query result
          updatedAt: 2019-10-31T20:37:24.000Z,  //<-- The same field name in both tables, causing the lost of information in the query result
          Title: 'Move 01',
          Year: 1995
        }
      ]

   */

  }
  catch ( ex ) {

    console.log( ex );

  }

}

async function selectInnerJoinFixedManually( dbConnection: any ) {

  try {

    //You need manually create alias for all fields in the query
    const rows = await dbConnection.query( "Select A.Id As A_Id, A.FirstName As A_FirstName, A.LastName As A_LastName, A.BirthDay As A_BirthDay, A.CreatedAt As A_CreatedAt, A.UpdatedAt As A_UpdatedAt, " + 
                                                  "C.Id As C_Id, C.Title As C_Title, C.Year As C_Year, C.CreatedAt As C_CreatedAt, C.UpdatedAt As C_UpdatedAt " + 
                                            "From Actor As A Inner Join ActorHasMovie As B On B.ActorId = A.Id Inner Join Movie As C On C.Id = B.MovieId", {
      raw: true,
      type: OriginalSequelize.QueryTypes.SELECT,
      //model: [ Actor, Movie ], //<--- 2 Models is not supported, only one model is supported, according to the sequelize doc
      //mapToModel: true  //<--- This option not work with 2 models, only one model is supported, according to the sequelize doc
    } );

    console.log( rows );

    /* OUTPUT

      [
        {
          A_Id: '415a1c3f-17ce-4141-8c2c-092df747f6b6', //<-- No lost of information in the result the alias in the field help to get the right value
          A_FirstName: 'Jose R',
          A_LastName: 'Rodriguez R',
          A_BirthDay: '1987-10-11',
          A_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          A_UpdatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_Id: '38123558-d3c8-4953-b692-bf376b97fd22', //<-- No lost of information in the result the alias in the field help to get the right value
          C_Title: 'Move 03',
          C_Year: 1995,
          C_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_UpdatedAt: 2019-10-31T20:57:46.000Z  //<-- No lost of information in the result the alias in the field help to get the right value
        },
        {
          A_Id: 'db94705b-212e-4984-ab57-22c058affb22', //<-- No lost of information in the result the alias in the field help to get the right value
          A_FirstName: 'Andres M',
          A_LastName: 'Gonzalez R',
          A_BirthDay: '1991-11-04',
          A_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          A_UpdatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_Id: 'c74088bf-4007-46db-8417-471115e1975d', //<-- No lost of information in the result the alias in the field help to get the right value
          C_Title: 'Move 02',
          C_Year: 1995,
          C_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_UpdatedAt: 2019-10-31T20:57:46.000Z  //<-- No lost of information in the result the alias in the field help to get the right value
        },
        {
          A_Id: '83b09645-f938-4e4c-ad4a-287e459e623d', //<-- No lost of information in the result the alias in the field help to get the right value
          A_FirstName: 'Tomas R',
          A_LastName: 'Moreno P',
          A_BirthDay: '1985-06-15',
          A_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          A_UpdatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_Id: 'f24dbaeb-dc4f-445e-aceb-74a7e3f1fffe', //<-- No lost of information in the result the alias in the field help to get the right value
          C_Title: 'Move 01',
          C_Year: 1995,
          C_CreatedAt: 2019-10-31T20:57:46.000Z, //<-- No lost of information in the result the alias in the field help to get the right value
          C_UpdatedAt: 2019-10-31T20:57:46.000Z //<-- No lost of information in the result the alias in the field help to get the right value
        }
      ]

   */

  }
  catch ( ex ) {

    console.log( ex );

  }

}

/* 
  PROPORSE FEATURE  

  ATTACH MULTIPLE MODELS TO SQL STATEMENT

    //Not needed manually create alias for all fields in the query
    const rows = await dbConnection.query( "Select A.*, C.* From Actor As A Inner Join ActorHasMovie As B On B.ActorId = A.Id Inner Join Movie As C On C.Id = B.MovieId", {
      raw: true,
      type: OriginalSequelize.QueryTypes.SELECT,
      model: [ { name: Actor, alias: "A" } , { name: Movie, alias: "C" } ], //<--- Here you attach 2 models or more
      mapToModel: true  //<--- Now work with 2 o more models
    } );

    OUTPUT (sequelize model mapped results):

      [
        [ //Row 1
          Movie {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          },
          Actor {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          }
        ],
        [ //Row 2
          Movie {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          },
          Actor {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          }
        ],
        [ //Row 3
          Movie {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          },
          Actor {
            dataValues: [Object],
            _previousDataValues: [Object],
            _changed: [Object],
            _modelOptions: [Object],
            _options: [Object],
            isNewRecord: true
          }
        ]
      ]
*/

async function main() {

  const dbConnection = await connectToDatabase( "dev" );

  await insertDataToDB( dbConnection );

  await selectInnerJoin( dbConnection );

  await selectInnerJoinFixedManually( dbConnection );

}

main();