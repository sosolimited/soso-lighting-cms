(function() {

	//Socket.io
	var messaging = io();

	messaging.on('connect', function() {
		console.log('Connected to server.');
	});

	messaging.on('currentState', function(msg) {
		console.log('Current State');
		console.log(msg.data);
		updateForm(msg.data);
	});

	// Add submit event listener to form to prevent default.
	var form = document.getElementById('on_off_controls');
	form.addEventListener("submit", formAction);

	// Add click events to radio buttons
	var radios = document.onOffControls.timeRadios;
	for (var i = 0; i < radios.length; i++) {
		var r  = radios[i];
		r.onclick = function() {
			if (this.value == 3) {
				enableTimeFields(true);
			} else {
				enableTimeFields(false);
			}
		};
	}

})();

function formAction(e) {
	e.preventDefault();

	var timeData = getTimeData();
	console.log(timeData)

	console.log('Apply Clicked!');
}

function getTimeData() {
	var mode = getMode( document.onOffControls.timeRadios.value );

	var data  = {
		mode: mode,
		on: {
			time_hour: 18,
			time_minute: 30
		},
		off: {
			time_hour: 5,
			time_minute: 00
		}
	};

	return data;
}

function getMode(iNumber) {
	switch(iNumber) {
		case '0':
			return 'alwaysOn';
			break;
		case '1':
			return 'alwaysOff';
			break;
		case '2':
			return 'sunsetSunrise';
			break;
		case '3':
			return 'custom';
			break;
		default:
			console.log('Unknown Mode!');
	}
}

function enableTimeFields( iEnabled ) {
	document.getElementById("on_hour").disabled = !iEnabled;
	document.getElementById("on_minute").disabled = !iEnabled;
	document.getElementById("off_hour").disabled = !iEnabled;
	document.getElementById("off_minute").disabled = !iEnabled;
}

function updateForm( iState ) {
	enableTimeFields(false);
	// check the mode
	switch(iState.mode) {
		case 'alwaysOn':
			document.getElementById("timeRadios1").checked = true;
			break;
		case 'alwaysOff':
			document.getElementById("timeRadios2").checked = true;
			break;
		case 'sunsetSunrise':
			document.getElementById("timeRadios3").checked = true;
			break;
		case 'custom':
			document.getElementById("timeRadios4").checked = true;
			enableTimeFields(true)
			break;
		default:
			console.log('Unknown Mode!');
	}

	//update times
	document.getElementById("on_hour").value = iState.on.time_hour;
	document.getElementById("on_minute").value = iState.on.time_minute;
	document.getElementById("off_hour").value = iState.off.time_hour;
	document.getElementById("off_minute").value = iState.off.time_minute;
}