/**
 * Created by tapostin on 9/29/16.
 */


class Get_user {


    static Create_db(cb) {

        let MongoC = require('mongodb').MongoClient;
        let assert = require('assert');

        var url = 'mongodb://localhost:27017/matcha';

        MongoC.connect(url, function (err, db) {
            if (err)
                throw err;
            
            // Get the documents collection
            db.collection('users').find().toArray((error, results) => {
                if (error) throw error;
                results.forEach((i)=> {
                    console.log(
                        "ID :" + i._id.toString() + "\n" +
                        "nom :" + i.nom + "\n" +
                        "desc :" + i.img_path + "\n"
                    )
                });
                cb(results)
            });

            db.close();
        })
    }

    static findUsers4(username, callback) {

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
}
// Establish connection to db


module.exports= Get_user;

