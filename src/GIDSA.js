// Modulo que define los plugins del frontend desarrollado por gidsa
// Este es el punto de acceso hacia el entorno GIDSA.
// Busca ser el unico punto de contacto con OpenMCT.
define(['./gidsa/utils/http-client'], function(Http) {
	// Realiza las llamadas previas a la inicializacion de OpenMCT
	function Gidsa() {
		this.http = new Http();
		this.http.post('https://ugsb.unlam.edu.ar/API/api-token-auth/', {
			username: 'anonym',
			password: 'anonym',
		}).then(res => {
			console.log('Login', res);
			this.http.setToken(res.token);
		});
		console.log('before openmct plugins');
	}

	/**
	 * Realiza la instalacion del entorno GIDSA y sus plugins.
	 * @param {*} openmct es el objeto de openmct que tiene el metodo install.
	 */
	Gidsa.prototype.install = openmctApi => {
		defineTypes(openmct);
		openmctApi.install(openmct => {
			console.log('Hello, World!')
		})
	};

	return Gidsa;
});

/*
 * Define los tipos de OpenMCT:
 * - Telemetria: las variables de telemetria.
 * - Directorio de satelites: el satelite en si.
 * @param {*} openmct el objeto openmct recibido al instalar
 */
function defineTypes(openmct) {
	const types = {
		'sat.telemetry': {
			name: 'Telemetry type',
			description: 'Telemetry point for every satellite.',
			cssClass: 'icon-telemetry',
		},
		'satellite': {
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
