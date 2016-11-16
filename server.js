var http =  	require('http');
var express = 	require('express');
var app = 		express();
var logger = 	require('./app/logger.js');

var state;

var server = http.createServer(app);
server.listen(8080);

logger.info('Sosolimited lighting CMS.');

var socketServer = require('./app/sockets.js')( server );
socketServer.newConnectionData = getState;

app.use( express.static(__dirname + '/public') ); // set public directory for static files

// Mock State
function getState() {
	if (!state) {
		state = { mode: 'custom', on: { time_hour: 18, time_minute: 30 }, off: { time_hour: 5, time_minute: 00 }};
	}
	return state;
}

// APP SHUTDOWN HANDLING
// =====================

// so the app won't close instantly.
process.stdin.resume();

function exitHandler(options, err) {
	if (options.cleanup) logger.info('Clean app shutdown.');
	if (err) logger.err(err.stack);
	if (options.exit) process.exit();
}

// When app is closing.
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// CTRL + C exit event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));