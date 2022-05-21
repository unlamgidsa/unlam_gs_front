define([
	'./constants'
], function(
	Constants
) {
	const defaultSattelite = 'TITA';
	const namesEntry = 'SatelliteList';

	function SatelliteService(url, http) {
		this.http = http;
		this.url = url;
	}

	SatelliteService.prototype.Satellites = function() {
		const entryPoint = `${this.url}/${namesEntry}`;
		return this.http.Get(entryPoint).then(satellites => satellites.map(s => ({
			name: s.code,
			key: Constants.SatelliteType
		})));
	}
	
	return SatelliteService;
});
