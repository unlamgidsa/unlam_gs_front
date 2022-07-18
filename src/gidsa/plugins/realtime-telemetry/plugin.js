define([
	'../../utils/constants',
], function(
	Constants,
) {
	function RealtimeTelemetry(wsUrl) {
		return function install(openmctApi) {
			const socket = new WebSocket(wsUrl);
			const listener = {};

			socket.onmessage = evt => {
				const point = JSON.parse(evt.data);
				if ( listener[point.id] )
					listener[point.id](point);
			}

			const provider = {
				supportsSubscribe: domObj => domObj.type === Constants.TelemetryType ,
				subscribe: (domObj, callback) => {
					const key = domObj.identifier.key;
					listener[key] = callback;
					socket.send(`subscribe ${key}`);
					return function unsubscribe() {
						delete listener[key];
						socket.send(`unsubscribe ${key}`);
					}
				}
			};

			openmctApi.telemetry.addProvider(provider);
		}
	}
	
	return RealtimeTelemetry;
})
