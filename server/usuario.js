var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var dbName = "agenda"
var operaciones = require('./insert.js')

MongoClient.connect(url, function(err, client){
  const db = client.db(dbName)
  if(err) console.log(err);
  console.log("Conexion establecida con la base de datos");
  operaciones.insertarRegistro(db, (error, result) =>{
    if(error) console.log("Error insertanto los registros: " + error)
  })
})
