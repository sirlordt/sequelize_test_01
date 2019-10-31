# sequelize_test_01

>  Rember create the TestDB2 with the next command

  ```sql 
  CREATE SCHEMA `TestDB2` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
  ```
  
In the file **config.json is the config for the database**, password, database name

Check the code in the file **index.ts**, functions **selectInnerJoin**, **selectInnerJoinFixedManually**, explain more.

PROPORSE FEATURE

ATTACH MULTIPLE MODELS TO SQL STATEMENT

```javascript 
  const rows = await dbConnection.query( "Select A.*, C.* From Actor As A Inner Join ActorHasMovie As B On B.ActorId = A.Id Inner Join Movie As C On C.Id = B.MovieId", {
    raw: true,
    type: OriginalSequelize.QueryTypes.SELECT,
    model: [ { name: Actor, alias: "A" } , { name: Movie, alias: "C" } ], //<--- Here you  attach 2 sequelize models or more
    mapToModel: true //<--- Now work with 2 sequelize models or more
  });

  console.log( rows );
```

OUTPUT (sequelize model Actor and Movie mapped in the result):

```json
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
```
    
