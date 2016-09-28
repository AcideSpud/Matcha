class Message {

	static create (content, callback){

		let mongo      = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", function(err, db){
			if (err){
				throw err
			}
			else {
				console.log("connecté a la base de donne 'matcha'")
				var mess = {name: "test", content: content}

				db.collection("messages").insert(mess, null, (err, res) =>{
					if (err){
						throw err
					}
					else
						console.log("le document a bien ete insere")
					callback(res)
				})		
			}
		})
	}
}

module.exports = Message
