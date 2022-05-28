define([
	'../../utils/constants'
], function(
	Constants
) {
	/**
	 * Mapea el diccionario de metadatos devuelto por el backend en un objeto de
	 * JavaScript con los campos 'satellite' y 'variables'.
	 * @param {string} namespace el namespace del satelite. `<nombre-satellite>`.
	 * @param {{name: string, measurements: {key: string, name: string, values: {*}}}} dict el
	 * diccionario devuelto por el backend.
	 * @return {{satellite: {}, variables: [{}]} un objeto con 'satellite' y
	 * 'variables'. Dentro de 'satellite' se encuentra la metadata del satelite,
		* y dentro de 'variables' hay un arreglo con los metadatos de cada variable
		* de telemetria del satelite.
	 */
	function mapMetadata(namespace, dict) {
		const satMetadata = {
			identifier: {
				namespace,
				key: Constants.SatelliteType
			},
			name: dict.name,
			type: Constants.SatelliteType,
			location: 'ROOT'
		};

		const varMetadata = dict.measurements.map(meta => ({
			identifier: {
				namespace,
				key: meta.key
			},
			name: meta.name,
			type: Constants.TelemtryType,
			telemetry: {
				values: meta.values,
			},
			location: `${namespace}:${Constants.SatelliteType}`,
		}));

		return {
			satellite: satMetadata,
			variables: varMetadata
		};
	}

	function TelemetryDictionary(sat, satService) {
		const namespace = `${sat.name}`;
		const satObjectPromise = satService.Dictionary(sat.name).then(dict => mapMetadata(namespace, dict));

		const objectProvider = {
			get: identifier => satObjectPromise.then(metadata => {
				if ( identifier.key === Constants.SatelliteType )
					return metadata.satellite;
				else
					return metadata.variables.filter(meta => meta.identifier.key === identifier.key)[0];
			})
		};
		const compositionProvider = {
			appliesTo: domObj => domObj.identifier.namespace === namespace && domObj.type === Constants.SatelliteType,
			load: () => satObjectPromise.then(metadata => metadata.variables.map(meta => meta.identifier))
		};

		return function install(openmctApi) {
			openmctApi.objects.addRoot({
				namespace,
				key: Constants.SatelliteType,
			});

			openmctApi.objects.addProvider(namespace, objectProvider);
			openmctApi.composition.addProvider(compositionProvider);
		};
	}

	return TelemetryDictionary;
});
