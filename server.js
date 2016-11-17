// Required components.
var http =  	require('http');
var express = 	require('express');
var app = 		express();
var logger = 	require('./app/logger.js');

// App Variables
var state; // used to store app state during run time.
var port = 8080;


// APP SETUP
// =====================

// Setup the http server and tell it to listen on specified port.
var server = http.createServer(app);
server.listen(port);

logger.info('Sosolimited lighting CMS. Listening on:', port);

// Setup the socket.io server by passing the http server to it.
var socketServer = require('./app/sockets.js')( server );

// Let the socket server know how to handle the state.
socketServer.newConnectionData = getState;
socketServer.saveData = setState;


// set public directory for static file serving on the http server.
app.use( express.static(__dirname + '/public') );


// ADDITIONAL FUNCTIONS
// =====================

// Get and set functions for the systems state.
// To be passed to the socket server.
function getState() {
	if (!state) {
		state = { mode: 'custom', on: { time_hour: 18, time_minute: 30 }, off: { time_hour: 5, time_minute: 00 }};
	}
	return state;
}

function setState( iState ) {
	logger.info("State Saved");
	// console.log(iState)
	state = iState;
}


// APP SHUTDOWN HANDLING
// =====================

// so the app won't close instantly.
process.stdin.resume();

function exitHandler(options, err) {
	if (options.cleanup) logger.info('Clean app shutdown.');
	if (err) logger.error(err.stack);
	if (options.exit) process.exit();
}

// When app is closing.
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// CTRL + C exit event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));