// Socket.io configurations below.
module.exports = {
	port : 3000,
	messages : {
		'updateOnOffTime': {
			title: 'updateOnOffTime',
			description: 'Message to listening clients to update the on and off time of the lights.',
			dataFormat: {
				on: {
					time_hour: 'number',
					time_minute: 'number'
				},
				off: {
					time_hour: 'number',
					time_minute: 'number'
				}
			}
		},
		'turnOn': {
			title: 'turnOn',
			description: 'Message to force lights to turn on.',
			dataFormat: 'boolean'
		},
		'turnOff': {
			title: 'turnOff',
			description: 'Message to force lights to turn off.',
			dataFormat: 'boolean'
		},
		'chime': {
			title: 'chime',
			description: 'Message to cue a chime by number.',
			dataFormat: 'number'
		}
	}
}