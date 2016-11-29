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

	this.server = io.listen( iServer );
	logger.info('socketio listening');

	this.server.on('connection', function(socket) {
		logger.info('socketio new client connection');

		// send state to new connection
		that.getState().then(function(state){
			socket.emit('current state', state );
		});

		socket.on('schedule', function(msg) {
			logger.info('socketio `schedule` received');

			that.getState().then(function(state){
				state.on = msg.on;
				state.off = msg.off;
				state.mode = 'schedule';

				this.server.emit('schedule', { on: state.on, off: state.off });

				saveState(state);
			});
		});

		socket.on('on', function() {
			logger.info('socketio `on` received');

			that.getState().then(function(state){
				state.mode = 'on';
				this.server.emit('on');

				saveState(state);
			});
		});

		socket.on('off', function(msg) {
			logger.info('socketio `off` received');

			that.getState().then(function(state){
				state.mode = 'off';
				this.server.emit('off');

				saveState(state);
			});
		});

		socket.on('chime', function(msg) {
			logger.info('socketio `chime` received (id: ' + msg.id + ')');

			this.server.emit('chime', msg);
		});

	});

	this.saveState = empty_promise;
	this.getState = empty_promise;
}

// allow interface for saving/getting state data to be set externally
SocketServer.prototype.setSaveStateFunc = function(prom){ this.saveState = prom; }
SocketServer.prototype.setGetStateFunc = function(prom){ this.getState = prom; }