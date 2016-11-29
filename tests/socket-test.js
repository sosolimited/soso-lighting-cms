var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:8080';

var options = {
	transports: ['websocket'],
	'force new connection': true
};

describe("CMS Socket.io Server", function() {

	it("Should receive updateOnOffTime and send onOffTime message.", function(done) {
		var client = io.connect(socketURL, options);
		var times = {
			on: {
				time_hour: 19,
				time_minute: 30
			},
			off: {
				time_hour: 5,
				time_minute: 00
			}
		};

		client.on('connect', function(data) {
			client.emit('custom', { description: 'new on and off times', data: times });
		});

		client.on('onOffTime', function(msg) {
			msg.response.should.equal("updateOnOffTime received");
			JSON.stringify(msg.data).should.equal(JSON.stringify(times) );
			client.disconnect();
			done();
		});
	});

	it("Should receive turnOn and send on message.", function(done) {
		var client = io.connect(socketURL, options);
		var client2 = io.connect(socketURL, options);

		client.on('connect', function(data) {
			client.emit('alwaysOn', { description: 'turn on lights', data: true });
		});

		client2.on('on', function(msg) {
			msg.response.should.equal("turnOn received");
			msg.data.should.equal(true);
			client.disconnect();
			client2.disconnect();
			done();
		});
	});

	it("Should receive turnOff and send off message.", function(done) {
		var client = io.connect(socketURL, options);
		var client2 = io.connect(socketURL, options);

		client.on('connect', function(data) {
			client.emit('alwaysOff', { description: 'turn off lights', data: true });
		});

		client2.on('off', function(msg) {
			msg.response.should.equal("turnOff received");
			msg.data.should.equal(true);
			client.disconnect();
			client2.disconnect();
			done();
		});
	});

	it("Should receive chime and send playChime message.", function(done) {
		var client = io.connect(socketURL, options);
		var client2 = io.connect(socketURL, options);
		var chime = 5

		client.on('connect', function(data) {
			client.emit('chime', { description: 'play chime associated with this number', data: chime });
		});

		client2.on('playChime', function(msg) {
			msg.response.should.equal("chime received");
			msg.data.should.equal(chime);
			client.disconnect();
			client2.disconnect();
			done();
		});
	});

});