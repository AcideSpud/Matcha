class Utilisateur {

	static GetDB(callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db) =>{
			if (err)
				throw err
			else{
				callback(db);
			}
		})
	}
	static findUsers(db, username, callback){

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=>{
			assert.equal(err, null)
			console.log(doc)
			if (doc){
				callback(doc)
			} else{
				callback()
			}
		})
	}

static findUsers3(username, callback){

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			let error;
			if (err){
				throw err
			}
			else{
				console.log("-----FIND USER MONGO")
				db.collection('users').find({name: username}).toArray(function (err, result) {
     		 	if (err) {
     		   		callback (err);
     		 	} else if (result.length) {
    		  	} else {
      		  		console.log('No document(s) found with defined "find" criteria!');
      		  		result = undefined
     		 	}
     		 	callback(result)
   		 		});
			}
		})
	}

	static updateUser(user, db, username, callback){
		console.log('-----UPDATE USER: ', username)
		db.collection("users").updateOne({"name": username}, {$set: {"email": user.email, "pwd": user.pwd,
											"nom": user.nom, "prenom": user.prenom, "like": user.like,
											"popularite": user.popularite, "genre": user.genre,
											"orientation": user.orientation, "age": user.age,
											"bio": user.bio}}, (err, res)=>{
			if (err) console.log("----/!/----ERROR UPDATE",err)
			console.log("fin update")
			callback()
		})
	}

	static insertUser(db, user, callback){
		db.collection("users").insert(user, null, (err, res)=>{
			if (err) throw err
			else{
				console.log("l'utilisateur a bien ete enregistre")
				callback(res)
			}
			
		})
	}

	static updateLikeUser(user, db, key){
		console.log('-----UPDATE ARRAY USER' + user + '[' + key + ']');

		db.collection("users").updateOne({"name" : user.name}, {$push:{"like": key }}, (err)=>{
			if (err)
				throw err;
			else
				console.log ("Update like OK !");
		})
		db.collection("users").updateOne({"name" : key}, {$push : {"liker" : user.name}}, (err)=>{
			if (err)
				throw err;
			else
				console.log("Update liker OK!");
		})
	}

	static updateUnlikeUser(user, db, key){
		db.collection("users").updateOne({"name" : user.name}, {$pull : {"like" : key }}, (err)=>{
			if (err)
				throw err;
			else
				console.log("remove like OK !");
		});
		db.collection("users").updateOne({"name" : key}, {$pull : {"liker" : user.name}}, (err)=>{
			if (err)
				throw err;
			else
				console.log("remove liker OK ! ");
		})
	}
	static modifUser(request, callback){
		let mongo = require('mongodb').MongoClient;
		var path = require('path'),
    		fs = require('fs');

    //	$.getJSON("http://ip-api.com/json/?callback=?", function(data) {
    //        var table_body = "";
    //        $.each(data, function(k, v) {
    //            table_body += "<tr><td>" + k + "</td><td><b>" + v + "</b></td></tr>";
    //        });
    //     //   $("#GeoResults").html(table_body);
    //     console.log(table_body)
    //    });


		//var ip_info = get_ip(request)

	/*	var ip = request.headers['x-forwarded-for'] || 
     request.connection.remoteAddress || 
     request.socket.remoteAddress ||
     request.connection.socket.remoteAddress;

     var ipp = '127.0.0.1';

		console.log("----IPPP INFOOO", ip)

		var geo= geoip.lookup(ipp)

		console.log("---GEOOOO", geo)
*/
		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			console.log("MODIF INFORMATION USER-----")
			if (err){
				throw err
			} else{
			//	console.log('-----MODIF USER: ', request.files.photos.path)
				var user = {email: request.body.email, pwd: request.body.pwd, nom: request.body.nom,
								prenom: request.body.prenom,
								age: request.body.age,
								genre: request.body.genre,
								orientation: request.body.orientation,
								bio: request.body.bio,
								 like: "", liker : "",  popularite: 0}
				console.log('---New User: ', user)
				this.updateUser(user, db, request.user.name, (res)=>{
					console.log('-----FIN MODIF USER')
				})

			}
		})
	}

	static create (request, response, callback){
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')
		

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			let error;
			if (err) throw err
			else{
				console.log("connecte a la base de donne matcha")
				var user = {name: request.body.name, email: request.body.email, pwd: request.body.pwd}

				this.findUsers(db, request.body.name, (doc)=>{
					console.log(doc , '  blbla')
					if (doc){
						console.log("le nom n\'est pas disponible")
						db.close
						request.flash('error', "Un Utilisateur utilise deja ce pseudo")

					} else {
						console.log('Le nom est disponible')
						this.insertUser(db, user, (res)=>{
							return callback(res)
						})
					}
					db.close;
				})
			}
		})
	}
}

module.exports= Utilisateur
