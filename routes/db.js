/**
 * Created by Tom on 20/09/2016.
 */
var MongoC = require('mongodb').MongoClient,
    assert = require('assert');


// Connection URL
var url = 'mongodb://localhost/MySuperDb';
//let my_db = function (){
//   let db =  new Db('MySuperDb', new Server('localhost', 3000));
//    db.open((err, db) => {
//        assert.equal(null, err);
//        my_db.on('close', test.done.bind(MySuperDb));
//        console.log("DB created !");
//
//        my_db.close();
//    });
//};
let Insert_Doc = (db, callback) => {
    var collection = db.collection('documents');
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
};

let i_db = function () {// Use connect method to connect to the Server
    MongoC.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db.collection('mytest').find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            //Insert_Doc(db, function () {
              //  console.log("Insert Done");
                //db.close();
            //});
        });
    });
};

module.exports = i_db;
//module.exports = my_db;

