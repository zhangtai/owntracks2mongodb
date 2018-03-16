const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs=require('fs');
 
// Connection URL
const url = 'mongodb://192.168.1.170:27017';
 
// Database Name
const dbName = 'owntracks';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
  const collection = db.collection('TrackPoints');
  const newOT = db.collection('newOT');

  collection.aggregate(
    [
       {
         $group : {
            _id : {
              year: { $year: "$insertDatetime" },
              month: { $month: "$insertDatetime" }, 
              day: { $dayOfMonth: "$insertDatetime" }, 
              hour: { $hour: "$insertDatetime" },
              minutes: { $minute: "$insertDatetime" },
              seconds: { $second: "$insertDatetime" },
              tst: "$tst"
              },
            firstID: { $first: "$_id" }
         }
       }
    ]
 ).toArray(function(err, docs) {
  assert.equal(err, null);
  console.log("Found the following records");
  let result = docs.map( doc => doc.firstID);
  //return result
  collection.find({
    "_id": { $in: result }
}).toArray(function(err, docs) {
    assert.equal(err, null);
    // console.log(docs);
    newOT.insertMany(docs, function(err, result) {
        assert.equal(err, null);
        console.log(result);
    })
})
})
  //client.close();
})