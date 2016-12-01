# Soso Lighting CMS Server
CMS / Web GUI to control lighting applications.

# Setup
1. `npm install`
2. `node server.js`
3. CMS accessible at [http://127.0.0.1:8080](http://127.0.0.1:8080). Point your socketio client to the same address + port.

# Tests
There is a basic test suite which covers the socketio server messaging and internal state persistence. When changing a protocol or adding new message types, improve/update `test/socket-test.js`. It's a good idea to run the tests before submitting a PR, or occasionally while you work.

To run tests: `npm test` at the root folder.

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

**register control app** - Send this immediately after connecting if you are the lighting control application. This ultimately supports a connectivity indicator in the CMS UI. No "de-register" message required. Must resend if you lose connection / reconnect.

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

**control app connected** - Sent to all clients when a lighting control app registers itself.

**control app disconnected** - Sent to all clients when a lighting control app that has previously registered itself disconnects from the server. If multiple clients have registered, the message is not sent until all have disconnected.