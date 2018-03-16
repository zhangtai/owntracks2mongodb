# Owntracks data store to Mongodb

Firstly config the data in `.env` or set the ENVs when running.

Build

`docker build -t zhangtai/owntracks2mongodb .`

Run

`docker run --rm --name ot2mongo -d zhangtai/owntracks2mongodb`

Env examples, create a `.env` file at root folder.

``` yml
MQTT_HOST='mqtt://channel.cloudmqtt.com'
MQTT_PORT=12345
MQTT_USER=mqttname
MQTT_PASSWD=mqttpassword
MQTT_CHANNEL='owntracks/mqttname/some-randome-id-of-mqttcloud'
MONGO_DB='mongodb://192.168.1.1:27017/mytrackings'
OT_DEVICE='iPhone 8 Plus'
```