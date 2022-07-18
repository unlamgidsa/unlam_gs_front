define([
	'../../utils/constants'
], function(
	Constants
) {
	function HistoricalTelemetry(satService) {
		const telemetryProvider = {
			supportsRequest: domObj => domObj.type === Constants.TelemetryType,
			request: (domObj, options) => {
				const satName = domObj.identifier.namespace.replace('.telemetry', '');
				const tlmyVar = domObj.name;
				const startDate = Math.floor(options.start);
				const endDate = Math.floor(options.end);
				return satService.Telemetry(satName, tlmyVar, startDate, endDate);
			}
		}

		return function install(openmctApi) {
			openmctApi.telemetry.addProvider(telemetryProvider);
		}
	}

	return HistoricalTelemetry;
})
