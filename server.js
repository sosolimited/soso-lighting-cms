// Required components.
var http =  	require('http');
var express = 	require('express');
var app = 		express();
var logger = 	require('./app/logger.js');
var config = require('./config/config.js');

// App Variables
var state; // used to store app state during run time.

// APP SETUP
// =====================

// pug templates
app.set('view engine', 'pug')

// Setup the http server and tell it to listen on specified port.
var server = http.createServer(app);
server.listen( config.http_port );

logger.info('Lighting CMS listening on: http://127.0.0.1:' + config.http_port);

// set public directory for static file serving on the http server.
app.use( express.static(__dirname + '/public') );

// root / renders pug template
app.get('/', function (req, res) {
  res.render('index', { chimes: config.chimes });
});

// Setup the socket.io server by passing the http server to it.
var socketServer = require('./app/sockets.js')( server );

// Let the socket server know how to handle the state.
// Temp until simple DB integration
socketServer.setSaveStateFunc( function(data){
	return new Promise(function(resolve, reject){
		state = data;
		resolve();
	});
});

socketServer.setGetStateFunc( function(){
	return new Promise(function(resolve, reject){
		if( !state ){
			state = {
				mode: 'schedule',
				on: { time_hour: 18, time_minute: 30 },
				off: { time_hour: 5, time_minute: 00 }
			};
		}

		resolve(state);
	});
});

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