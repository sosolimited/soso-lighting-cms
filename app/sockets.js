//Socket.io Controller
var io = require('socket.io');

/**
 * Module exports.
 */

module.exports = SocketServer;

/**
* Interface
*/

function SocketServer( iServer ) {
	if (!(this instanceof SocketServer)) return new SocketServer( iServer );
	var that = this;

	this.server = io.listen( iServer );
	console.log('Socket Server Listening');

	this.server.on('connection', function(socket) {
		that.newConnection(socket);

		socket.on('custom', function(msg) {
			console.log('custom time range received');
			that.newData(msg.data);
			that.handleUpdateOnOffTime(socket, msg);
		});

		socket.on('alwaysOn', function(msg) {
			console.log('alwaysOn received');
			that.newData(msg.data);
			that.handleTurnOn(socket, msg);
		});

		socket.on('alwaysOff', function(msg) {
			console.log('alwaysOff received');
			that.newData(msg.data);
			that.handleTurnOff(socket, msg);
		});

		socket.on('chime', function(msg) {
			console.log(`chime received (${msg.id})`);
			that.handleChime(socket, msg);
		});

	});

	this.newConnectionData;
	this.saveData;
}

SocketServer.prototype.newConnection = function( iSocket ) {
	// Add error checking for functions.
	var data = (this.newConnectionData) ? this.newConnectionData() : "There doesn't seem to be any data.";
	iSocket.emit('currentState', { data: data });
}

SocketServer.prototype.newData = function( iData ) {
	if (this.saveData) {
		this.saveData( iData );
	} else {
		console.log("New unsaved Data:", iData);
	}
}

SocketServer.prototype.handleUpdateOnOffTime = function(iSender, iMsg) {

	// handle any data manipulation.
	var times = {
		on: {
			time_hour: iMsg.data.on.time_hour,
			time_minute: iMsg.data.on.time_minute
		},
		off: {
			time_hour: iMsg.data.off.time_hour,
			time_minute: iMsg.data.off.time_minute
		}
	};

	this.server.emit('onOffTime', { response: 'updateOnOffTime received', data: times });
};

SocketServer.prototype.handleTurnOn = function(iSender, iMsg) {

	this.server.emit('on', { response: 'turnOn received', data: {} });
};

SocketServer.prototype.handleTurnOff = function(iSender, iMsg) {

	this.server.emit('off', { response: 'turnOff received', data: {} });
};

SocketServer.prototype.handleChime = function(iSender, iMsg) {

	this.server.emit('playChime', { response: 'chime received', data: iMsg });
};