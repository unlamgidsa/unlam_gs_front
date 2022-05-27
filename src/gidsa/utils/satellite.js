define([
	'./constants'
], function(
	Constants
) {
	const defaultSattelite = 'TITA';
	const namesEntry = 'SatelliteList';
	const dictEntry  = 'TlmyVarDict';

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

	/**
	 * Obtiene el diccionario (sus metadatos) de un satelite.
	 * @param {string} satName el nombre del satelite, e.g. TITA.
	 * @return {Promise} una promise con los metadatos.
	 */
	SatelliteService.prototype.Dictionary = function(satName) {
		const entryPoint = `${this.url}/${dictEntry}/${satName}`;
		return this.http.Get(entryPoint);
	}
	
	return SatelliteService;
});
