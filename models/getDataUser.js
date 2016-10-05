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

                console.log("Connecté à la base de données");
                    // Get the documents collection
                db.collection('users').find().toArray((error, results) =>{
                    if (error) throw error;
                    console.log(results);
                    results.forEach((i)=>{
                      console.log(
                          "ID :" + i._id.toString() + "\n" +
                          "nom :" + i.nom + "\n" +
                          "desc :" + i.img_path + "\n"
                      )});
                    cb(results)
                    });

                db.close();
            })
        }

// Establish connection to db

        static Get_info(db, user) {






            }
        }

module.exports= Get_user;