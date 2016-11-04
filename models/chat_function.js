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

	static findChatRoom(name, callback) {

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=> {
			let error;
			if (err) {
				throw err
			}
			else {
				db.collection('chatRoom').find({name: name}).toArray(function (err, result) {
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

	static modifContent(name, content, callback) {

		this.GetDB(function(cb){
				db.collection("chatRoom").updateOne({"name": name},{
				$push: {"content": content}
			},(err, res)=>{
				if (err) throw err
					callback()
			})

		})

		
	}

	static createChatroom(name, callback){
		
		var chatRoom = {name: name,
						content: {
							userName: [],
							content:[]
						}}
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