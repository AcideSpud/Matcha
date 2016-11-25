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

	static modifContent(name, usernames, content, callback) {

		console.log('USERNAMES----', usernames, 'CONTENT---', content)

		this.GetDB(function(db){
				db.collection("chatRoom").updateOne({"chatRoomName": name},{
				$push: {"userNames": usernames, "content": content}
			},(err, res)=>{
				if (err) throw err
					callback()
			})

		})
	}

	static createChatroom(name, callback){
		
		var chatRoom = {chatRoomName: name,
						userNames: [],
						content: []
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