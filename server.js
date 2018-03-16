#!/usr/bin/env node
require('dotenv').config()
const mqtt = require('mqtt')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const nasmongourl = process.env.MONGO_DB


const mqtt_options = {
    port: process.env.MQTT_PORT,
    host: process.env.MQTT_HOST,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWD,
    keepalive: 0,
    reconnectPeriod: 30000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
}

let insertDocuments = function(db, data, callback) {
    let collection = db.collection('owntracks')
    collection.insertOne(data, function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      assert.equal(1, result.ops.length)
      console.log(new Date() + " Inserted 1 documents into the collection")
      callback(result)
    })
}

const client = mqtt.connect(process.env.MQTT_HOST, mqtt_options);
client.on('connect', function() { // When connected
    console.log('connected cloudmqtt service');
    client.subscribe(process.env.MQTT_CHANNEL, function() {
        client.on('message', function(topic, message, packet) {
            let trackPoint = JSON.parse(message)

            if (trackPoint["_type"] != "location") {
                console.log("ignored, this is not location data.")
            } else {
                trackPoint.deviceName = process.env.OT_DEVICE
                trackPoint.insertDatetime = new Date()
                trackPoint.geopoint = {
                    type: "Point",
                    coordinates: [trackPoint.lon, trackPoint.lat]
                }

                MongoClient.connect(nasmongourl, function(err, db) {
                    assert.equal(null, err)
                    insertDocuments(db, trackPoint, function() {
                        db.close()
                    })
                })
            }
        })
    })
})