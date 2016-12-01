var should = require('should');
var io = require('socket.io-client');

// note: these tests require running the server as a separate process
var socketURL = 'http://0.0.0.0:8080';

var options = {
	transports: ['websocket'],
	'force new connection': true
};

describe("CMS socketio server", function() {
	var cinder_client;
	var web_client;

	beforeEach(function(){
		cinder_client = io.connect(socketURL, options);
		web_client = io.connect(socketURL, options);
	});

	afterEach(function(){
		cinder_client.disconnect();
		web_client.disconnect();
	});

	it("Should emit current state on new connection.", function(done) {
		web_client.on('current state', function(state){
			state.should.have.property('mode');
			state.should.have.propertyByPath('on','time_hour');
			state.should.have.propertyByPath('on','time_minute');
			state.should.have.propertyByPath('off','time_hour');
			state.should.have.propertyByPath('off','time_minute');
			done();
		});
	});

	it("Should relay `on` messages.", function(done) {
		cinder_client.on('on', function(){
			done();
		});

		web_client.emit('on');
	});

	it("Should relay `off` messages.", function(done) {
		cinder_client.on('off', function(){
			done();
		});

		web_client.emit('off');
	});

	it("Should relay `chime` messages.", function(done) {
		cinder_client.on('chime', function(chime){
			chime.id.should.eql('test chime');
			done();
		});

		web_client.emit('chime', {id: 'test chime'});
	});

	it("Should relay `set color` messages.", function(done) {
		var c = [255,0,0];

		cinder_client.on('set color', function(msg){
			msg.id.should.eql(95);
			msg.rgb.should.eql(c);
			done();
		});

		web_client.emit('set color', {id: 95, rgb: c});
	});

	it("Should relay `set all colors` messages.", function(done) {
		var c = [255,0,0,255,255,255,0,0,255,0,0,0];

		cinder_client.on('set all colors', function(msg){
			msg.should.eql(c);
			done();
		});

		web_client.emit('set all colors', c);
	});

	it("Should relay `schedule` messages.", function(done) {
		var test_schedule = {
			on: { time_hour: 7, time_minute: 30 },
			off: { time_hour: 19, time_minute: 0 }
		};

		cinder_client.on('schedule', function(sched){
			sched.should.eql(test_schedule);
			done();
		});

		web_client.emit('schedule', test_schedule);
	});

	it("Should maintain internal cache of current on/off schedule.", function(done) {
		var test_schedule = {
			on: { time_hour: 6, time_minute: 0 },
			off: { time_hour: 18, time_minute: 0 }
		};

		cinder_client.disconnect();

		web_client.emit('schedule', test_schedule, function(){
			cinder_client = io.connect(socketURL, options);

			cinder_client.on('current state', function(state){
				state.on.should.eql(test_schedule.on);
				state.off.should.eql(test_schedule.off);
				done();
			});
		});
	});

	it("Should notify web client when lighting control app registers.", function(done){
		cinder_client.disconnect();

		web_client.on('control app connected', function(){
			done();
		});

		cinder_client = io.connect(socketURL, options);
		cinder_client.emit('register control app');
	});

	it("Should notify web client when lighting control app disconnects.", function(done){
		web_client.on('control app connected', function(){
			cinder_client.disconnect();
		});

		web_client.on('control app disconnected', function(){
			done();
		});

		cinder_client.emit('register control app');
	});
});