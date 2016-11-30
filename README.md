# Soso Lighting CMS Server
CMS / Web GUI to control lighting applications.

# Setup
1. `npm install`
2. `node server.js`
3. CMS accessible at [http://127.0.0.1:8080](http://127.0.0.1:8080). Point your socketio client to the same address + port.

# Messaging Protocol
The server shuttles socketio messages between any controlling clients (e.g. web CMS) and the lighting control app. There are messages the server can receive from controlling clients, and messages the lighting control app should expect to receive from the server. Some messages require/attach meta data. See below for details.

## Server can receive:
**on** - Turn the lights on.

**off** - Turn the lights off.

**schedule** - Set the on/off schedule (24hr time).
```json
{
    "on": {
        "time_hour": 18,
        "time_minute": 30
    },
    "off": {
        "time_hour": 6,
        "time_minute": 30
    }
}
```

**chime** - Play a special chime as specified by text id.
```json
{
    "id": "pulse"
}
```

**set color** - Set the color of a single fixture.
```json
{
    "id": 321,
    "rgb": [255,0,0]
}
```

**set all colors** - Set each light fixture individually packed as a flattened list of RGB triplets.
```javascript
[
    255,0,0,
    100,20,255,
    0,255,0,
    // ...
]
```

## Server can emit:
**on** - Turn the lights on.

**off** - Turn the lights off.

**schedule** - Set the on/off schedule (24hr time).
```json
{
    "on": {
        "time_hour": 18,
        "time_minute": 30
    },
    "off": {
        "time_hour": 6,
        "time_minute": 30
    }
}
```

**chime** - Play a chime.
```json
{
    "id": "pulse"
}
```

**current state** - Emitted on new connection. Current state of the server.
```javascript
{
    "mode": "schedule" // schedule | on | off
    "on": {
        "time_hour": 18,
        "time_minute": 30
    },
    "off": {
        "time_hour": 6,
        "time_minute": 30
    }
}
```

**set color** - Set the color of a single fixture.
```json
{
    "id": 321,
    "rgb": [255,0,0]
}
```

**set all colors** - Set each light fixture individually, packed as a flattened list of RGB triplets.
```javascript
[
    255,0,0,
    100,20,255,
    0,255,0,
    // ...
]
```
