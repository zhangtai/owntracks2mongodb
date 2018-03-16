# Owntracks data store to Mongodb

Subscribe MQTT broker(cloud mqtt) and save track points into mongodb with docker.

Install Owntracks app on your phone, register an cloudmqtt accoount and get the necessary details which listed in below config code block. After config successfully on your phone, follow below steps to create an docker image app to save your trackpoints.

You need to create a `.env` file at root folder with below config, all fields are required.

``` yml
MQTT_HOST='mqtt://channel.cloudmqtt.com'
MQTT_PORT=12345
MQTT_USER=mqttname
MQTT_PASSWD=mqttpassword
MQTT_CHANNEL='owntracks/mqttname/some-randome-id-of-mqttcloud'
MONGO_DB='mongodb://192.168.1.1:27017/mytrackings'
OT_DEVICE='iPhone 8 Plus'
```

Build docker images by:

`docker build -t yourname/owntracks2mongodb .`

Run

`docker run --rm --name ot2mongo -d yourname/owntracks2mongodb`