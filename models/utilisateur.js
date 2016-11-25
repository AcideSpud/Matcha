class Utilisateur {

	static		GetDB(callback) {
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db) => {
			if (err)
				throw err
			else {
				callback(db);
			}
		})
	}

	static		findUsers(db, username, callback) {

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=> {
			assert.equal(err, null)
			if (doc) {
				callback(doc)
			} else {
				callback(undefined)
			}
		})
	}

	static		findUsers3(username, callback) {

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

	static		modifPwd(username, pwd, callback) {
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

	static		updateChatroom(db, chatRoom, callback){
		
		db.collection("chatRoom").updateOne({"name": chatRoom.name},{
			$set: {"name": chatRoom.name, "content": chatRoom.content
			}
		},(err, res)=>{
			if (err) throw err
			callback()
		})
	}

	static		updateUser(user, db, username, callback) {

		db.collection("users").updateOne({"name": username}, {
			$set: {
				"email": user.email, "pwd": user.pwd,
				"nom": user.nom, "prenom": user.prenom, "like": user.like,
				"popularite": user.popularite, "genre": user.genre,
				"orientation": user.orientation, "age": user.age,
				"bio": user.bio, "tag": user.tag,
				"geo": user.geo,
				"city": user.city
			}
		}, (err, res)=> {
			if (err) throw err
			callback()
		})
	}

	static		updateReported(db , reportedUser) {
		db.collection("users").updateOne({"name": reportedUser}, {
			$set: {
				"reported" : true
			}
		}, (err)=> {
			if (err) throw err;
		})
	}


	static		updateLastCo(db , date, userName, callback) {
		console.log(date);
		db.collection("users").updateOne({"name": userName.name}, {
			$set: {
				"lastCo": date
			}
		}, (err)=> {
			if (err) throw err;
		})
		callback(null);
	}

	static		updateMainChatRoom(db, username, focusName) {
		this.findUsers3(username, (res)=> {
			console.log('username----:', username);
			console.log('focusName---:', focusName);
			if (res[0]) {
				for (var i = 0; i < res[0].matchRoom.length; i++) {
					if (res[0].matchRoom[i].indexOf(focusName) == 0) {
						var focus = res[0].matchRoom[i];
						break;
					}
				}
			}
			if (res[0] && focus)
				db.collection("users").updateOne({"name": username}, {
					$set: {"focus": focus}
				}, (err, res)=> {
					if (err) throw err;
				})
		})
	}



	static		updateVisit(user, db, key){
		this.findUsers3(user, (res)=>{
			if (res[0])
				db.collection("users").updateOne({"name": user}, {
					$push : {"visit": { "user": key , "date" :Date.now() } }
				}, (err, res)=>{
					if (err) throw err;
				})

		})
	}

	static		checkMatch(user, db, key){

		this.findUsers3(user.name, (res)=>{
			if (res[0].liker)
				for (var i = 0; i < res[0].liker.length; i++){
					console.log('LES PERSONNES QUE JE LIKE' +res[0].like[i]);
					console.log('LES PERSONNES QUI ME LIKE'  +res[0].liker[i]);
					if (res[0].liker[i] === key){
						console.log('MATCHHH');
						this.updateMatchUser(user, db, key);
					}
					else
						console.log('pas match')
				}
			else (console.log('personne updateMatch'))
		})

	}

	static		checkUnMatch(user, db, key){

		this.findUsers3(user.name, (res)=>{
			if (res[0].liker)
				for (var i = 0; i < res[0].liker.length; i++){
					console.log('LES PERSONNES QUE JE LIKE' +res[0].like[i]);
					console.log('LES PERSONNES QUI ME LIKE'  +res[0].liker[i]);
					if (res[0].liker[i] === key){
						console.log('UNNNMATCHHH');
						this.updateUnMatchUser(user, db, key);
					}
					else
						console.log('pas match')
				}
			else (console.log('personne updateMatch'))
		})

	}

	static		updateMatchUser(user, db, key) {

		console.log('user----:'+ user.name);
		console.log('key----:' + key)

		db.collection("users").updateOne({"name": user.name}, {$push: {"matchRoom": key+user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update like OK !");
		})
		db.collection("users").updateOne({"name": key}, {$push: {"matchRoom":key+user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update liker OK!");
		})
	}

	static		updateUnMatchUser(user, db, key) {

		console.log('user----:'+ user.name);
		console.log('key----:' + key)

		db.collection("users").updateOne({"name": user.name}, {$pull: {"matchRoom": key+user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update like OK !");
		})
		db.collection("users").updateOne({"name": key}, {$pull: {"matchRoom": key+user.name}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("Update liker OK!");
		})
	}


	static		updateLikeUser(user, db, key) {

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

	static		updateUnlikeUser(user, db, key) {
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

	static		updateLocalisation(loca, name){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			db.collection("users").find({name: name}, {$set: {"country": loca}}, (err)=>{
				if (err)
					throw err;
				else;
			})
		})

	}


	static		modifUser(request, callback) {
		let mongo = require('mongodb').MongoClient;
		var path = require('path'),
			fs = require('fs');

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let bcrypt = require('bcryptjs')
			var hashtag = require('find-hashtags')
			var hash = bcrypt.hashSync(request.body.pwd);
			var hobbies = hashtag(request.body.hashtag);

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
					geo: JSON.parse(request.body.geo),
					country: request.body.country,
					city: request.body.city
				}
				this.updateUser(user, db, request.user.name, (res)=> {
				})
			}
		})
	}

	static		queryUserByMail(mail, callback) {
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

	static		deleteIMG(username, imgpath, callback){
		let mongo = require('mongodb').MongoClient;
		
		mongo.connect('mongodb://localhost/matcha', (err, db)=> {
			db.collection("users").updateOne({"name": username}, {$pull: {"img": imgpath}}, (err, res)=> {
				if (err) throw err
				else
					callback()
			})
		})
	}

	static      uploadImg2(username, imgpath, callback) {
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

	static      create(request, response) {
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
					geo: [],
					match: ["test", "test2"],
					visit: [], reported: false, lastCo: new Date(),
					matchRoom: [],
					focus: []
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

	static      deleteImg(request, response){
		var async = require('async');


	}
	static		sortReported(otherUserArray, callback){
		let ret = [];
		let cmp = 0;

		for (let i = 0, len = otherUserArray.length; i < len; i++){
			if (otherUserArray[i].reported == false){
				ret[cmp] = otherUserArray[i];
				cmp++;
			}
		}
		callback(ret);
	}

	static      SortPrefSexUser(user, otherUserArray, callback) {

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
	static		sortAge(otherUserArray, callback){
		var byAge = otherUserArray.slice(0);
		byAge.sort(function(a,b) {
			return a.age - b.age;
		});
		//let ret = Object.keys(otherUserArray.age).sort(function(a,b){return list[a]-list[b]});
		callback(byAge);
	}

	static		sortPop(otherUserArray, callback){
		var byPop = otherUserArray.slice(0);
		byPop.sort(function(a,b) {
			return a.popularite - b.popularite;
		});
		//let ret = Object.keys(otherUserArray.age).sort(function(a,b){return list[a]-list[b]});
		callback(byPop);
	}
	static		sortDist(otherUserArray, callback){
		var byDist = otherUserArray.slice(0);
		byDist.sort(function(a,b) {
			return a.geo - b.geo;
		});
		//let ret = Object.keys(otherUserArray.age).sort(function(a,b){return list[a]-list[b]});
		callback(byDist);
	}

	static		sortByAge(ageMin, ageMax, otherUserArray, callback) {
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

	static		sortByPop(popMin, popMax, otherUserArray, callback) {
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



	static      updatePop(nbScore, userToUp, db) {
		db.collection("users").updateOne({"name": userToUp[0].name}, {$set: {"popularite": nbScore}}, (err)=> {
			if (err)
				throw err;
			else
				console.log("popularite update OK !");
		});
	}
	static      tcheckIf(user , otherUserArray)
	{
		let mbool = true;
		if (user.geo.latitude){
			for (let i = 0, len = otherUserArray; i < len ; i++){
				if (!otherUserArray[i].geo.latitude && !otherUserArray[i].geo.longitude)
					mbool = false;
			}
			return mbool;
		}
		else
			return (mbool = false);

	}
	static      GetDistance(user, otherUserArray, callback) {
	    if (this.tcheckIf(user, otherUserArray)){
		    let geolib = require('geolib');
		    let userLatitude = user.geo.latitude.toString();
		    userLatitude = userLatitude.substring(0, 8);
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
                    ret[i] = {dist: dist};
                }
            }
            callback(ret);
		}
        else
            callback(null);

	}
	static      SortDistance(user, otherUserArray, distance, callback)
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
    static      sortByTag(otherUserArray, callback){
        var byTag = otherUserArray.slice(0);
        byTag.sort(function(a,b) {
            return a.nTag - b.nTag;
        });
        //let ret = Object.keys(otherUserArray.age).sort(function(a,b){return list[a]-list[b]});
        callback(byTag);
    }

    static      nbTag(user , otherUserArray, callback){
        let comTag = new Array;
        let cmp2 = 0;
        let cmp = 0;
        comTag[cmp] = new Array;
        for (let i = 0, len = otherUserArray.length; i < len; i++) {
            comTag[cmp] = new Array;
            for (let j = 0, lan = otherUserArray[i].tag.length; j < lan; j++) {
                for (let k = 0, lon = user.tag.length; k < lon; k++) {
                    if (user.tag[k] == otherUserArray[i].tag[j]) {
                        comTag[cmp][cmp2] = {name: otherUserArray[i].name, tag: otherUserArray[i].tag[j]};
                        cmp2++;
                    }
                }
            }
            cmp2 = 0;
            cmp++;
        }

        nbTagUser = user.tag.length;
        let tab = new Array;
        for (let i = 0, len = comTag.length; i < len; i++) {
            tab[i] = {name: comTag[i][0].name, size: comTag[i].length};
        }
        callback(tab);
	}

    static      SortTag(user, otherUserArray, val, callback) {
        let nbTagOther = [];
        let nbTagUser = null;
        let ret = [];
        let comTag = new Array;
        let cmp2 = 0;
        let cmp = 0;
        comTag[cmp] = new Array;
        if (val == 2)
            val = 25;
        else if (val == 3)
            val = 50;
        else if (val == 4)
            val = 75;
        if (val == 1) {
            callback(otherUserArray);
        }
        else {
            for (let i = 0, len = otherUserArray.length; i < len; i++) {
                comTag[cmp] = new Array;
                for (let j = 0, lan = otherUserArray[i].tag.length; j < lan; j++) {
                    for (let k = 0, lon = user.tag.length; k < lon; k++) {
                        if (user.tag[k] == otherUserArray[i].tag[j]) {
                            comTag[cmp][cmp2] = {name: otherUserArray[i].name, tag: otherUserArray[i].tag[j]};
                            cmp2++;
                        }
                    }
                }
                cmp2 = 0;
                cmp++;
            }

            nbTagUser = user.tag.length;
            let tab = new Array;
            for (let i = 0, len = comTag.length; i < len; i++) {
                tab[i] = {name: comTag[i][0].name, size: comTag[i].length};
            }
            for (let i = 0, len = tab.length; i < len; i++) {
                nbTagOther[i] = {name: tab[i].name, percent: tab[i].size * 100 / nbTagUser};
            }
            let j = 0;
            for (let i = 0, len = otherUserArray.length; i < len; i++) {
                for (let k = 0, lon = nbTagOther.length; k < lon; k++) {

                    if (otherUserArray[i].name == nbTagOther[k].name && nbTagOther[k].percent >= val) {
                        ret[j] = otherUserArray[i];
                        j++;
                    }
                }
            }
            callback(ret);
        }
    }

}

module.exports= Utilisateur;