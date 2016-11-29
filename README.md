# Soso Lighting CMS Server
CMS / Web GUI to control lighting applications.

# Messaging Protocol
The server shuttles socketio messages between any controlling clients (e.g. web CMS) and the lighting control app. There are messages the server can receive from controlling clients, and messages the lighting control app should expect to receive from the server. Some messages require/attach meta data. See below for details.

## Server can receive:
**on** - turn the lights on

**off** - turn the lights off

**schedule** - set the on/off schedule (24hr time)
```
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

**chime** - play a special chime as specified by text id
```
    {
        "id": "pulse"
    }
```

## Server can emit:
**on** - turn the lights on

**off** - turn the lights off

**schedule** - set the on/off schedule (24hr time)
```
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

**chime** - Play a chime
```
    {
        "id": "pulse"
    }
```

**current state** - Emitted on new connection. Current state of the server.
```
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