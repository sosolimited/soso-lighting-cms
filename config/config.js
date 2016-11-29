// Socket.io configurations below.
module.exports = {
	http_port: 8080,
	chimes: [
		{
			id: "wave",
			title: "Play wave animation"
		},
		{
			id: "waterfall",
			title: "Play waterfall animation"
		},
		{
			id: "pulse",
			title: "Play pulse animation"
		}
	],
	default_state: {
		mode: 'schedule',
		on: { time_hour: 18, time_minute: 30 },
		off: { time_hour: 5, time_minute: 00 }
	}
}