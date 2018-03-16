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
  const collection = db.collection('drafts');
  
  fs.readFile("./data/DraftsExport_20180227.json", (err, result) => {
    if(err) {
        console.log("error when reading data")
    } else {
        let rs = JSON.parse(result)
        let holder = rs
        holder.map(p => {
          if(p.created_longitude > 1 && p.created_longitude < 200 && p.created_latitude > 1 && p.created_latitude < 200) {
                        p.created_date = new Date(p.created_at)
            p.trackPoint = {
                type: "Point",
                coordinates: [ p.created_longitude, p.created_latitude ]
            }
          } 
        })
        collection.insertMany(holder, function(err, final) {
          assert.equal(err, null);
          console.log(`insert completed`);
        })
        collection.createIndex(
          { trackPoint : "2dsphere" }, function(err, result) {
          console.log("index creation completed");
        });
        }
    })
  //client.close();
})