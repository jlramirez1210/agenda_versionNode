module.exports.insertarRegistro = function(db, callback){
  let coleccion = db.collection("tb_usuario");
  coleccion.insertMany([
    {id: 1, nombre: "Jorge Ramirez", fecha_nac: "1985-10-12", correo: "jlramirez1210@gmail.com", clave: "123"},
    {id: 2, nombre: "Lizbeth Guillen", fecha_nac: "1987-04-25", correo: "lizbethguillenrf@gmail.com", clave: "456"},
    {id: 1, nombre: "Usuario", fecha_nac: "2018-05-05", correo: "prueba@gmail.com", clave: "789"}
  ], (error, result) => {
    console.log("Resultado de insert " + result.toString())
  })
}
