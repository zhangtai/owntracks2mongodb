const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs=require('fs');
 
// Connection URL
const url = 'mongodb://192.168.1.170:27017';
 
// Database Name
const dbName = 'mytrackings';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
  const collection = db.collection('googlehistory');
  
  fs.readFile("./data/GoogleLocationHistory_zustiger.json", (err, result) => {
    if(err) {
        console.log("error when reading data")
    } else {
        let rs = JSON.parse(result)
        let holder = rs.locations
        holder.map(p => {
            p.datetime = new Date(parseInt(p.timestampMs))
            p.trackPoint = {
                type: "Point",
                coordinates: [ p.longitudeE7 * 10e-8, p.latitudeE7 * 10e-8 ]
            }
        })
        collection.insertMany(holder, function(err, final) {
          assert.equal(err, null);
          console.log(`insert completed`);
        })
        collection.createIndex(
          { trackPoint : "2dsphere", datetime : 1 }, function(err, result) {
          console.log("index creation completed");
        });
        }
    })
  //client.close();
})