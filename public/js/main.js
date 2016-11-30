(function() {

	//Socket.io
	var messaging = io();

	messaging.on('connect', function() {
		console.log('Connected to server.');
		$(".connection").attr('data-status', 'connected');
	});

	messaging.on('current state', function(msg) {
		console.log('Current state');
		console.log(msg);
		updateForm(msg);
	});

	messaging.on('disconnect', function(msg){
		console.log("disconnected from server");
		$(".connection").attr('data-status', 'disconnected');
	})

	messaging.on('control app connected', function(){
		console.log('io control app connected');
		$(".connection").attr('data-status', 'control-app-connected');
	});

	messaging.on('control app disconnected', function(){
		console.log('io control app disconnected');
		$(".connection").attr('data-status', 'connected');
	});

	// Add submit event listener to form to prevent default.
	var form = document.getElementById('on_off_controls');
	form.addEventListener("submit", formAction(messaging) );

	// Add click events to radio buttons
	var radios = document.onOffControls.timeRadios;
	for (var i = 0; i < radios.length; i++) {
		var r  = radios[i];
		r.onclick = function() {
			if (this.value == 'schedule') {
				enableTimeFields(true);
			} else {
				enableTimeFields(false);
			}
		};
	}

	// add click events to buttons
	$(".chime-button").click(function(){
		messaging.emit('chime', {
			id: $(this).attr('data-id'),
			title: $(this).attr('data-title')
		});
	});

})();

function formAction(iSocket) {
	var eventHandler = function(e) {
		e.preventDefault();

		var timeData = getTimeData();

		if( timeData.mode == 'schedule' ){
			iSocket.emit('schedule', { on: timeData.on, off: timeData.off });
		}
		else {
			iSocket.emit(timeData.mode);
		}

		console.log('Apply Clicked!');
	}
	return eventHandler;
}

function getTimeData() {
	var data  = {
		mode: document.onOffControls.timeRadios.value,
		on: {
			time_hour: parseInt( document.getElementById("on_hour").value ),
			time_minute: parseInt( document.getElementById("on_minute").value )
		},
		off: {
			time_hour: parseInt( document.getElementById("off_hour").value ),
			time_minute: parseInt( document.getElementById("off_minute").value )
		}
	};

	return data;
}

function enableTimeFields( iEnabled ) {
	document.getElementById("on_hour").disabled = !iEnabled;
	document.getElementById("on_minute").disabled = !iEnabled;
	document.getElementById("off_hour").disabled = !iEnabled;
	document.getElementById("off_minute").disabled = !iEnabled;
}

function updateForm( iState ) {
	enableTimeFields(false);

	$("input[value='" + iState.mode + "']")[0].checked = true;

	if (iState.mode == 'schedule') enableTimeFields(true);

	//update times
	document.getElementById("on_hour").value = iState.on.time_hour;
	document.getElementById("on_minute").value = iState.on.time_minute;
	document.getElementById("off_hour").value = iState.off.time_hour;
	document.getElementById("off_minute").value = iState.off.time_minute;
}