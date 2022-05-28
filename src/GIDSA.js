// Modulo que define los plugins del frontend desarrollado por gidsa
// Este es el punto de acceso hacia el entorno GIDSA.
// Busca ser el unico punto de contacto con OpenMCT.
define([
	'./gidsa/utils/http-client',
	'./gidsa/utils/login',
	'./gidsa/utils/satellite',
	'./gidsa/utils/constants',
	'./gidsa/plugins/telemetry-dictionary/plugin',
	'./gidsa/plugins/historical-telemetry/plugin',
], function(
	Http,
	LoginService,
	SatelliteService,
	Constants,
	TelemetryDictionary,
	HistoricalTelemetry,
) {
	const urlBase = 'https://ugsb.unlam.edu.ar/API';
	const loginEntry = `${urlBase}//api-token-auth/`;

	// Realiza las llamadas previas a la inicializacion de OpenMCT
	function Gidsa() {
		this.http = new Http();
		this.loginService = new LoginService(`${loginEntry}`, this.http);
		this.satelliteService = new SatelliteService(urlBase, this.http);

		const loginPromise = this.loginService.Login().then(token => this.http.SetToken(token));
		this.satellitesPromise = loginPromise.then(t => this.satelliteService.Satellites());
	}

	/**
	 * Realiza la instalacion del entorno GIDSA y sus plugins.
	 * @param {*} openmct es el objeto de openmct que tiene el metodo install.
	 */
	Gidsa.prototype.Install = function (openmctApi) {
		this.defineTypes(openmctApi);

		return this.satellitesPromise.then(satellites => {
			for ( const s of satellites ) {
				const sat = {
					name: s.name,
					key: s.key,
				};
				openmctApi.install(TelemetryDictionary(sat, this.satelliteService));
			}
			openmctApi.install(HistoricalTelemetry(this.satelliteService));
		})
	};

	/*
	 * Define los tipos de OpenMCT:
	 * - Telemetria: las variables de telemetria.
	 * - Directorio de satelites: el satelite en si.
	 * @param {*} openmct el objeto openmct recibido al instalar
	 */
	Gidsa.prototype.defineTypes = function(openmct) {
		const types = {
			'sat.telemetry': {
				name: 'Telemetry type',
				description: 'Telemetry point for every satellite.',
				cssClass: 'icon-telemetry',
			},
			[Constants.SatelliteType]: {
				name: 'Satellite directory',
				description: 'Satellite directory where telemetry points reside',
				cssClass: 'icon-object',
			},
		};

		// Agrego todos los tipos definidos en type
		for ( const typeName in types ) {
			const type = types[typeName];
			openmct.types.addType(typeName, type);
		}
	}

	return Gidsa;
});
