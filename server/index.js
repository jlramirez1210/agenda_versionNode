//Importo librerias requeridas
var bodyParser  = require('body-parser');
var http        = require('http');
var express     = require('express');
var events      = require('./router');
var session     = require("express-session");
var MongoClient = require('mongodb').MongoClient;

//declaro variables
var port = 3000;
var app = express();
var url = "mongodb://localhost:27017";
var dbName = "agenda";

//usa las librerias necsesarias
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));
app.use(session({ secret: "defrfdlo", resave: false, saveUninitialized: false }));

//creo el servidor
var server = http.createServer(app);

app.post("/login",function (req, res){
	MongoClient.connect(url, function (err, db){
		if (err) throw err;
		var base = db.db("agenda");
		var coleccion = base.collection("tb_usuario");
		coleccion.findOne({correo: req.body.user, clave: req.body.pass}, function (error, user){
			if (error) throw error;
			if (user){
				req.session.email_user = user.correo;
				res.send("Validado");
			}else{
				res.send("Usuario o contraseña incorrecto");
			}
		});
		  db.close();
	});
});

app.use('/events', events);
server.listen(port, ()=>{
  console.log("Server is running on port " + port);
});
