class Chat {

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

	static findAllRooms(callback){

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			} else{
				db.collection('chatRoom').find().toArray((err, res)=>{
					if (err){
						callback(err)
					} if (res){

					} else{
						res = undefined
					}
					callback(res)
				})
			}
		})
	}

	static	findOther(username, crn){
		this.findChatRoom(crn, (res)=>{
			if (res[0]){
				return res[0].other;
			}
		})
	}


	static	findWho(username, crn, callback){
		
		this.findChatRoom(crn, (res)=>{
			if (res){
				for (var i = 0; i < res.length; i++) {
					if(res[i].me === username)
						callback(res[i])
				}
			}
		})
	}

	static findChatRoom(name, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			if (err) {
				throw err
			}
			else {

				db.collection('chatRoom').find({chatRoomName: name}).toArray(function (err, result) {
					if (err) {
						callback(err);
					}
					if (result[0]) {

					} else {
						result = undefined
					}
					callback(result)
					db.close();
				});
			}
		})
	}

	static modifContent(name, user, conten, crn, callback){

		var d = new Date();
    	var n = d.toLocaleDateString("en-GB");

    	var message = {user: user, content: conten, date: n, isRead: false, crn: crn};

    	console.log('MODIF CONTENT: ', name, user, conten, crn);

		this.GetDB((db)=>{
			db.collection("chatRoom").updateOne({"chatRoomName": name}, {
				$push: {"conte": message}},
				(err)=>{
					if (err)
						throw err;
					else
						callback();
					db.close();
				})
			})
		}


	static	checkNbNotif(name, user, callback){
		var nb = 0;

			this.findChatRoom(name, (res)=>{
				if (res[0]){
					for (var i = 0; i<res[0].conte.length; i++){
						if (res[0].conte[i].isRead == false && res[0].conte[i].user != user){
							nb++;
						}
					}
					callback(nb);
				}
			})
	}

	static	readAllMsg(name, callback){
		this.GetDB(function(db){
			db.collection("chatRoom").updateOne({"chatRoomName": name},
				{$set: {"conte.isRead": true}}, (err)=>{
					if(err) throw err;
					else
						callback()
					db.close();
				})
			})
	}

	static	readAllMsg2(name, moi, callback){
		this.GetDB(function(db){
			db.collection("chatRoom").find({"chatRoomName": name})
  				.forEach(function (doc) {
    				doc.conte.forEach(function (conte) {
      					if (conte.user !== moi) {
        				conte.isRead = true;
      					}
      					
    				});
   		 		db.collection("chatRoom").save(doc);
   		 		db.close();
  			});
		})
	}

	static	createChatroom2(m, o, callback){
		var name = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".shuffle();

		var chatRoom = {chatRoomName: name,
						conte:[],
						other: o,
						me: m
						}
		this.GetDB((db)=>{
			db.collection("chatRoom").insert(chatRoom, null, (err, res)=>{
				if (err) throw err;
				else{
					callback(name);
				}
				db.close();
			})
		})
	}

	static	findSameRoom(user, key, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				db.collection('chatRoom').find({me: user, other: key}).toArray(function (err, result) {
					if (err) {
						callback(err);
					}
					if (result[0]) {

					} else {
						result = undefined
					}
					callback(result)
					db.close();
				});
			}
		})
	}

	static	deleteChatroom(chatRoomName, callback){
		this.GetDB((db)=>{
			db.collection("chatRoom").remove({"chatRoomName": chatRoomName}, (err, res)=>{
				callback(chatRoomName);
				db.close();
			})
		})

	}

	static createChatroom(name, callback){
		
		var chatRoom = {chatRoomName: name,
						me: [],
						other: [],
						conte:[]
						}
		this.GetDB(function(db){
			db.collection("chatRoom").insert(chatRoom, null, (err, res)=>{
				if (err) throw err;
				else{
					callback()
				}
				db.close();
			})
		})
	}
}

module.exports = Chat;