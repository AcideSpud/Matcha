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
				console.log('FINDCHATROOM(CHAT_FUNCTION:)', name)
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

		this.GetDB((db)=>{
			db.collection("chatRoom").updateOne({"chatRoomName": name}, {
				$push: {"cont": {"user": user, "content": conten, "date": n, "isRead": false}}},
				(err)=>{
					if (err)
						throw err;
					else
						console.log("chatRoom modifContent OOK");
				})
			})
		}

	static modifMyContent(name, me, mycontent, callback) {

		console.log('USERNAMES----', usernames, 'CONTENT---', content)

		this.GetDB(function(db){
				db.collection("chatRoom").updateOne({"chatRoomName": name},{
				$push: {"me": me, "mycontent": mycontent}
			},(err, res)=>{
				if (err) throw err
					callback()
			})

		})
	}

	static modifYourContent(name, you, yourcontent, callback) {

		console.log('USERNAMES----', usernames, 'CONTENT---', content)

		this.GetDB(function(db){
				db.collection("chatRoom").updateOne({"chatRoomName": name},{
				$push: {"you": you, "yourcontent": yourcontent}
			},(err, res)=>{
				if (err) throw err
					callback()
			})

		})
	}


	static	checkNbNotif(name, user, callback){
		var nb = 0;

		this.findChatRoom(name, (res)=>{
			if (res[0]){
				for (var i = 0; i<res[0].cont.length; i++){
					if (res[0].cont[i].isRead == false && res[0].cont[i].user != user)
						nb++;
				}
				callback(nb);
			}
		})
	}

	static	readAllMsg(name, callback){
		this.GetDB(function(db){
			db.collection("chatRoom").updateOne({"chatRoomName": name},
				{"cont": {"isRead": true}}, (err)=>{
					if(err) throw err;
					else
						callback()
				})
			})
	}

	static createChatroom(name, callback){
		
		var chatRoom = {chatRoomName: name,
						/*cont: {
							user: [],
							content: [],
							date: [],
							isRead: []
						},*/
						notif:[],
						me: [],
						you: [],
						mycontent: [],
						yourcontent: []
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