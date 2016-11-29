// Required components.
var http =  	require('http');
var express = 	require('express');

var app = 		express();
var logger = 	require('./app/logger.js');
var config = require('./config/config.js');

var SimpleDB = require('./app/simpleDB.js');
var db = new SimpleDB(__dirname + '/config/state.json');

// App Variables
var state; // used to store app state during run time.

// APP SETUP
// =====================

// pug templates
app.set('view engine', 'pug');

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

// STATE.JSON FILE STORE SETUP
// =====================

// read in existing state.json or create new one
db.init().then(function(){
	// If db does not contain state, save default settings.
	// This can happen on first time server startup.
	db.getObject('state').then(function(){
		logger.info('loaded state.json from disk');
	},function(err){
		logger.info("filling state.json file with default configuration");

		db.setObject('state', config.default_state).catch(function(err){
			logger.error('error while saving default state');
			throw err;
		});
	});
}, function(err){
	logger.error('error while initializing SimpleDB');
	throw err;
});


// Let the socket server know how to handle the state.
// Write to simple JSON object store on disk for persistence
socketServer.handleSaveState( function(data){
	return db.setObject('state', data);
});

socketServer.handleGetState( function(){
	return db.getObject('state');
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