//Socket.io Controller
var io = require('socket.io');
var config = require('../config/config.js');
var logger = require('./logger.js');

/**
 * Module exports.
 */

module.exports = SocketServer;

/**
* Interface
*/

var empty_promise = function(){
	return new Promise(function(resolve, reject){
		reject();
	});
}

function SocketServer( iServer ) {
	if (!(this instanceof SocketServer)) return new SocketServer( iServer );
	var that = this;

	// support multiple control apps (maybe useful, maybe not)
	this.control_apps = 0;

	this.server = io.listen( iServer );
	logger.info('io listening');

	this.server.on('connection', function(socket) {
		logger.info(`io new client connection (${ that.short(socket) })`);

		// send state to new connection
		that.getState().then(function(state){
			socket.emit('current state', state );
		});

		// tell about connected control app
		if( that.control_apps > 0 ){
			socket.emit('control app connected');
		}

		socket.on('disconnect', function(){
			logger.info(`io client disconnected (${ that.short(socket) })`);

			if( socket.hasOwnProperty('control_app') ){
				that.control_apps--;

				if( that.control_apps == 0 ){
					logger.info('io notifying clients no control apps connected');
					that.server.emit('control app disconnected');
				}
			}
		});

		socket.on('schedule', function(msg, done) {
			logger.info('io `schedule` received');

			that.getState().then(function(state){
				state.on = msg.on;
				state.off = msg.off;
				state.mode = 'schedule';

				that.server.emit('schedule', { on: state.on, off: state.off });

				// callback when saveState completes
				that.saveState(state).then(function(){
					done();
				});
			});
		});

		socket.on('on', function() {
			logger.info('io `on` received');

			that.getState().then(function(state){
				state.mode = 'on';
				that.server.emit('on');

				that.saveState(state);
			});
		});

		socket.on('off', function(msg) {
			logger.info('io `off` received');

			that.getState().then(function(state){
				state.mode = 'off';
				that.server.emit('off');

				that.saveState(state);
			});
		});

		socket.on('chime', function(msg) {
			logger.info('io `chime` received (id: ' + msg.id + ')');

			that.server.emit('chime', msg);
		});

		socket.on('set color', function(msg){
			logger.info(`io \`set color\` received (id: ${msg.id}, rgb: ${msg.rgb})`);

			that.server.emit('set color', msg);
		});

		socket.on('set all colors', function(msg){
			logger.info(`io \`set all colors\` received (num triplets: ${msg.length / 3})`);

			that.server.emit('set all colors', msg);
		});

		// Allow a client to identify as lighting app, so the CMS UI can
		// indicate if the app is available for changes.
		socket.on('register control app', function(){
			socket.control_app = true;
			that.control_apps++;

			logger.info('io control app registered');

			// all sockets except this one
			socket.broadcast.emit('control app connected');
		});
	});

	this.saveState = empty_promise;
	this.getState = empty_promise;
}

// allow interface for saving/getting state data to be set externally
SocketServer.prototype.handleSaveState = function(prom){ this.saveState = prom; }
SocketServer.prototype.handleGetState = function(prom){ this.getState = prom; }

SocketServer.prototype.short = function(socket){
	return socket.id.slice(0,6);
}