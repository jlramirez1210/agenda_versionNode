var express = require("express");
var MongoClient=  require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
var router =  express.Router();

router.get("/all", function (req, res){
	if (req.session.email_user){
		MongoClient.connect(url, function (err, db){
			var base = db.db("agenda");
			var coleccion = base.collection("tb_evento");
			coleccion.find({id_usuario: req.session.email_user}).toArray(function (error, eventos){
				if (error) throw erro;
				res.send(eventos);
			});
		  db.close();
		});
	}else{
		res.send("No esta loqueado");
	}
});

router.post("/new", function (req, res){
	if (req.session.email_user){
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			var base = db.db("agenda");
			var coleccion = base.collection("tb_evento");
			var nID = req.body.title.trim() + Math.floor(Math.random(0),100)+1;
			coleccion.save({
				_id:nID,
				titulo:req.body.title,
				fecha_inicio:req.body.start,
				fecha_final: req.body.end,
				hora_inicio: req.body.start_hour,
				hora_final: req.body.end_hour,
				id_usuario: req.session.email_user
			});
			db.close();
		});
	}else{
		res.send("No esta loqueado");
	}
});

router.post("/delete", function (req, res){
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		var base = db.db("agenda");
		var coleccion = base.collection("tb_evento");
		try{
			coleccion.remove({
				_id:req.body.id,
				id_usuario: req.session.email_user
			});
			res.send("Se ha borrado exitosamente");
		}catch (err){
			res.send(err);
		}
		db.close();
	});
});

router.post("/update", function (req, res){
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		var base = db.db("agenda");
		var coleccion = base.collection("tb_evento");
		try {
			coleccion.update(
				{_id:req.body.id },
				{$set:{
						fecha_inicio: req.body.start,
						fecha_final: req.body.end,
						hora_final: req.body.end_hour,
						hora_inicio: req.body.start
					}
				}
			);
			res.send("Se ha actualizado correctamente");
		}catch(e){
			console.log(e);
		}
		db.close();
	});
});

module.exports = router;
