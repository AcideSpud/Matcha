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
				db.collection('users').find({name: username}).toArray(function (err, result) {
					if (err) {
						callback(err);
					}
					if (result[0]) {

					} else {
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
			db.collection("users").updateOne({"name": username}, {$set: {"pwd": pwd}}, (err, res)=> {
				if (err) callback(err)
				else {
					callback()
				}
			})
		})

	}

	static updateUser(user, db, username, callback) {

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
			if (err) throw err
			console.log("fin update")
			callback()
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
			let bcrypt = require('bcryptjs')
			var hashtag = require('find-hashtags')
			var hash = bcrypt.hashSync(request.body.pwd);
			var hobbies = hashtag(request.body.hashtag)

			if (err) {
				throw err
			} else {
				var user = {
					email: request.body.email, pwd: hash, nom: request.body.nom,
					prenom: request.body.prenom,
					age: parseInt(request.body.age),
					genre: request.body.genre,
					orientation: request.body.orientation,
					bio: request.body.bio,
					like: [], liker: [], popularite: 0,
					tag: hobbies,
					geo: JSON.parse(request.body.geo)
				}
				this.updateUser(user, db, request.user.name, (res)=> {
				})
			}
		})
	}

	static queryUserByMail(mail, callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
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

		mongo.connect('mongodb://localhost/matcha', (err, db)=> {
			var path = '/img/' + imgpath;
			db.collection("users").updateOne({"name": username}, {$push: {"img": path}}, (err, res)=> {
				if (err) throw err
				else
					callback()
			})
		})
	}

	static create(request, response) {
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) throw err
			else {
				var hash = bcrypt.hashSync(request.body.pwd);
				var user = {
					name: request.body.name,
					email: request.body.email,
					pwd: hash,
					question: request.body.questionSecrete,
					reponse: request.body.repQuestion,
					img: [],
					orientation: "Bi",
					geo: []
				}

				this.findUsers3(request.body.name, (result)=> {
					if (result != undefined) {
						request.flash('error', "Un Utilisateur utilise deja ce pseudo")
						response.redirect('/inscription');
					} else if (result == undefined) {
						db.collection("users").insert(user, null, (err, res)=> {
							if (err) throw err;
							else {
								request.flash('success', "Vous êtes bien enregistré!")
								response.redirect('/login')
							}
						})
					}
					db.close;
				})
			}
		})
	}

	static deleteImg(request, response){
		var async = require('async');


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
					if (otherUserArray[i].genre == 'Mme' || otherUserArray[i].genre == 'M' && otherUserArray[i].orientation == 'Ht') {
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
					if (otherUserArray[i].genre == 'Mme' || otherUserArray[i].genre == 'M' && otherUserArray[i].orientation == 'Hm') {
						res[cmp] = otherUserArray[i];
						cmp++;
					}
				}
			}
		}
		else if (user.orientation == 'Bi') {
			for (let i = 0, len = otherUserArray.length; i < len; i++) {
				if ((otherUserArray[i].genre == 'Mme' || otherUserArray[i].genre == 'M' || otherUserArray[i].genre == 'Tran')  &&
					otherUserArray[i].name != user.name) {
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
				cmp++;
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
				cmp++;
			}
		}
		callback(res);
	}

	static  updatePop(nbScore, userToUp, db) {
		db.collection("users").updateOne({"name": userToUp[0].name}, {$set: {"popularite": nbScore}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("popularite update OK !");
		});
	}
	static	GetDistance(user, otherUserArray, callback) {
		let geolib = require('geolib');
		let userLatitude = user.geo.latitude.toString();
		userLatitude = userLatitude.substring(0, 8);
		console.log("userlatitude == " + userLatitude);
		let userLongitude = user.geo.longitude.toString();
		userLongitude = userLongitude.substring(0, 8);
        let ret = [];
        let otherLatitude = null;
        let otherLongitude = null;
        let userpos = null;
        let otherpos = null;
        let dist = null;
		if (otherUserArray) {
			for (let i = 0, len = otherUserArray.length; i < len; i++) {
                otherLatitude = null;
                otherLongitude = null;
                userpos = null;
                otherpos = null;
                dist = null;
				otherLatitude = otherUserArray[i].geo.latitude.toString();
				otherLatitude = otherLatitude.substring(0, 8);
				otherLongitude = otherUserArray[i].geo.longitude.toString();
				otherLongitude = otherLongitude.substring(0, 8);
				userpos = {latitude: userLatitude, longitude: userLongitude};
				otherpos = {latitude: otherLatitude, longitude: otherLongitude};
				dist = geolib.getDistance(userpos, otherpos);
                dist = geolib.convertUnit('km', dist, 0);
				ret[i] = {dist : dist};
			}
		}
		else {
		    ret = otherUserArray;
        }
		callback(ret);
	}
	static SortDistance(user, otherUserArray, distance, callback)
    {
        let res = [];
        let cmp = 0;
        this.GetDistance(user, otherUserArray, (cb)=>{
            for (let i = 0, len = otherUserArray.length; i < len; i++) {
               if (cb[i].dist <= distance){
                   res[cmp] = otherUserArray[i];
                   cmp++;
               }
            }
            callback(res);
        });
    };

    static SortTag(user, otherUserArray, val, callback){
        let nbTagOther = null;
        let nbTagUser = null;
        let comTag = new Array;

        let cmp2 = 0;
        let cmp = 0;
        if (val == 1) {
            callback(otherUserArray);
        }
        else if (val == 2){
            for (let i=0, len = otherUserArray.length; i < len; i++){
                for (let j=0, lan = otherUserArray[i].tag.length; j < lan; j++){
                    for (let k=0, lon = user.tag.length; k < lon; k++){
                        comTag[cmp] = new Array;
                        if (user.tag[k] == otherUserArray[i].tag[j]){
                            comTag[cmp][cmp2] = otherUserArray[i].tag[j];
                            cmp2++;
                        }
                    }
                    cmp++;
                    cmp2 = 0;
                }
            }
            console.log(comTag);
        }
        else if (val == 3){

        }
        else {

        }
    }

}




module.exports= Utilisateur;
