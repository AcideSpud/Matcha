class Utilisateur {

	static GetDB(callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db) => {
			if (err)
				throw err
			else {
				callback(db);
			}
		})
	}


	static findUsers(db, username, callback) {

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=> {
			assert.equal(err, null)
			console.log(doc)
			if (doc) {
				callback(doc)
			} else {
				callback(undefined)
			}
		})
	}


	static findUsers3(username, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				console.log("-----FIND USER MONGO")
				db.collection('users').find({name: username}).toArray(function (err, result) {
					if (err) {
						callback(err);
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

	static modifPwd(username, pwd, callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			console.log('-------MODIFPWD', pwd);
			console.log('-----MODIFPWD USERNAME', username)
			db.collection("users").updateOne({"name": username}, {$set: {"pwd": pwd}}, (err, res)=> {
				if (err) callback(err)
				else {
					callback()
				}
			})
		})

	}

	static updateUser(user, db, username, callback) {
		console.log('-----UPDATE USER: ', username)
		db.collection("users").updateOne({"name": username}, {
			$set: {
				"email": user.email, "pwd": user.pwd,
				"nom": user.nom, "prenom": user.prenom, "like": user.like,
				"popularite": user.popularite, "genre": user.genre,
				"orientation": user.orientation, "age": user.age,
				"bio": user.bio, "tag": user.tag,
				"geo": user.geo
			}
		}, (err, res)=> {
			if (err) console.log("----/!/----ERROR UPDATE", err)
			console.log("fin update")
			callback()
		})
	}


	static insertUser(db, user, callback) {
		db.collection("users").insert(user, null, (err, res)=> {
			if (err) throw err
			else {
				console.log("l'utilisateur a bien ete enregistre")
				callback(res)
			}

		})
	}

	static updateLikeUser(user, db, key) {
		console.log('-----UPDATE ARRAY USER' + user + '[' + key + ']');

		db.collection("users").updateOne({"name": user.name}, {$push: {"like": key}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update like OK !");
		})
		db.collection("users").updateOne({"name": key}, {$push: {"liker": user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update liker OK!");
		})
	}

	static updateUnlikeUser(user, db, key) {
		db.collection("users").updateOne({"name": user.name}, {$pull: {"like": key}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("remove like OK !");
		});
		db.collection("users").updateOne({"name": key}, {$pull: {"liker": user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("remove liker OK ! ");
		})
	}


	static modifUser(request, callback) {
		let mongo = require('mongodb').MongoClient;
		var path = require('path'),
			fs = require('fs');

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) {
				throw err
			} else {
				var user = {
					email: request.body.email, pwd: request.body.pwd, nom: request.body.nom,
					prenom: request.body.prenom,
					age: request.body.age,
					genre: request.body.genre,
					orientation: request.body.orientation,
					bio: request.body.bio,
					like: [], liker: [], popularite: 0,
					tag: request.body.tag,
					geo: request.body.geo
				}
				this.updateUser(user, db, request.user.name, (res)=> {
				})
			}
		})
	}


	static queryUserByMail(mail, callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			console.log('-----QUERY USER BY MAIL', mail)
			db.collection("users").find({email: mail}).toArray((err, result)=> {
				if (err)
					callback(err);
				else if (result.length) {
				} else {

					console.log('No document(s) found with defined "find" criteria!');
					result = undefined
				}
				callback(result);
			});
		})
	}

	static uploadImg2(username, imgpath, callback) {
		let mongo = require('mongodb').MongoClient;

        mongo.connect('mongodb://localhost/matcha', (err, db)=>{
			var path = '/img/'+ imgpath;
			db.collection("users").updateOne({"name": username}, {$push: {"img": path}}, (err, res)=>{

				if (err) throw err
				else
					callback()
			})
		})
	}

	static create(request, response, callback) {
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')


		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) throw err
			else {
				console.log("connecte a la base de donne matcha")

				var user = {name: request.body.name, email: request.body.email, pwd: request.body.pwd, question: request.body.questionSecrete, reponse: request.body.repQuestion, orientation: "Bi", geo: []}


				this.findUsers(db, request.body.name, (doc)=> {
					console.log(doc, '  blbla')
					if (doc) {
						console.log("le nom n\'est pas disponible")
						db.close
						request.flash('error', "Un Utilisateur utilise deja ce pseudo")

					} else {
						console.log('Le nom est disponible')
						this.insertUser(db, user, (res)=> {
							return callback(res)
						})
					}
					db.close;
				})
			}
		})
	}

	static SortPrefSexUser(user, otherUserArray, callback) {

		let res = [];
		let cmp = 0;
		if (user.orientation == 'Ht') {
			if (user.genre == 'M') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'Mme' && otherUserArray[i].orientation == 'Ht') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
			else if (user.genre == 'Mme') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'M' && otherUserArray[i].orientation == 'Ht') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
			else if (user.genre == 'Tran') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'Mme' || otherUserArray.genre == 'M' && otherUserArray[i].orientation == 'Ht') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
		}
		else if (user.orientation == 'Hm') {
			if (user.genre == 'M') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'M' && otherUserArray[i].name != user.name && otherUserArray[i].orientation == 'Hm') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
			else if (user.genre == 'Mme') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'Mme' && otherUserArray[i].name != user.name && otherUserArray[i].orientation == 'Hm') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
			else if (user.genre == 'Tran') {
				for (let i = 0, len = otherUserArray.length; i < len; i++) {
					if (otherUserArray[i].genre == 'Mme' || otherUserArray.genre == 'M' && otherUserArray[i].orientation == 'Hm') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
		}
		else if (user.orientation == 'Bi') {
			for (let i = 0, len = otherUserArray.length; i < len; i++) {
				if (otherUserArray[i].genre == 'Mme' || otherUserArray.genre == 'M' || otherUserArray.genre == 'Tran') {
					res[cmp] = otherUserArray[i];
					cmp++;
				}
			}
		}
		callback(res);
	}

	static    sortByAge(ageMin, ageMax, otherUserArray, callback) {
		let res = [];
		let cmp = 0;

		for (let i = 0, len = otherUserArray.length; i < len; i++) {
			if (otherUserArray[i].age >= ageMin && otherUserArray[i].age <= ageMax) {
				res[cmp] = otherUserArray[i];
			}
		}
		callback(res);
	}

	static    sortByPop(popMin, popMax, otherUserArray, callback) {
        let res = [];
        let cmp = 0;

        for (let i = 0, len = otherUserArray.length; i < len; i++) {
            if (otherUserArray[i].popularite >= popMin && otherUserArray[i].popularite <= popMax) {
                res[cmp] = otherUserArray[i];
            }
        }
        callback(res);
    }
    static  updatePop(nbScore, userToUp, db){
            db.collection("users").updateOne({"name": userToUp[0].name}, {$set: {"popularite": nbScore}}, (err)=> {
                if (err)
                    throw err;
                else
                    console.log("popularite update OK !");
            });
    }



}

module.exports= Utilisateur;
