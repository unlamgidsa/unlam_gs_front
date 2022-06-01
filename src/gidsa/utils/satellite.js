define([
	'./constants'
], function(
	Constants
) {
	const defaultSattelite = 'TITA';
	const namesEntry     = 'SatelliteList';
	const dictEntry      = 'TlmyVarDict';
	const tlmyEntry      = 'TlmyVarList';
	const timestampEntry = 'GetLastTelemetryTimeStamp';

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

	/**
	 * Obtiene la telemetria para un satelite y una variable de telemetria, desde
	 * una `fecha desde` hasta una `fecha hasta`.
	 * @param {string} satName el nombre del satelite, e.g. TITA.
	 * @param {string} tlmyVar el nombre de la variable de telemtria, e.g. CPU_C.
	 * @param {string|number} from la `fecha desde` para filtrar la telemetria.
	 * @param {string|number} to la `fecha hasta` para filtrar la telemetria.
	 * @return {Promise} una promise con la telemetria.
	 */
	SatelliteService.prototype.Telemetry = function(satName, tlmyVar, from, to) {
		const entryPoint = `${this.url}/${tlmyEntry}/${satName}.${tlmyVar}/${from}/${to}`;
		return this.http.Get(entryPoint);
	}

	return SatelliteService;
});
