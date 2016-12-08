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
						result = undefined
					}
					callback(res)
				})
			}

		})

	}

	static findChatRoom(name, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
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
				});
			}
		})
	}

	static modifContent(name, user, conten){

		var d = new Date();
    	var n = d.toLocaleDateString("en-GB");

    	var message = {user: user, content: conten, date: n, isRead: false};

		this.GetDB((db)=>{
			db.collection("chatRoom").updateOne({"chatRoomName": name}, {
				$push: {"conte": message}},
				(err)=>{
					if (err)
						throw err;
					else
						console.log("chatRoom modifContent OOK");
				})
			})
		}


	static	checkNbNotif(name, user, callback){
		var nb = 0;

		this.findChatRoom(name, (res)=>{
			if (res[0]){
				for (var i = 0; i<res[0].conte.length; i++){
					if (res[0].conte[i].isRead == false && res[0].conte[i].user != user)
						nb++;
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
				})
			})
	}

	static	readAllMsg2(name, autre, callback){
		this.GetDB(function(db){
			db.collection("chatRoom").find({"chatRoomName": name})
  				.forEach(function (doc) {
    				doc.conte.forEach(function (conte) {
      					if (conte.user === autre) {
        				conte.isRead = true;
      					}
      					
    				});
   		 		db.collection("chatRoom").save(doc);
  			});
		})
	}

	static createChatroom(name, callback){
		
		var chatRoom = {chatRoomName: name,
						conte:[]
						}
		this.GetDB(function(db){
			db.collection("chatRoom").insert(chatRoom, null, (err, res)=>{
				if (err) throw err;
				else{
					callback()
				}
			})
		})
	}
}

module.exports = Chat;