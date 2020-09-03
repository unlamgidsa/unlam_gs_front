import * as http from "../http-server/service.js";

export class TelemetryProvider {
	constructor(openmct, urlBase) {
		this._openmct = openmct;
		this._urlBase = urlBase;
	}

	addProvider() {
		this._openmct.telemetry.addProvider(getProvider(this._urlBase));
	}
}

function getProvider(urlBase) {
	return {
		supportsRequest: function(domainObject) {
			return domainObject.type === "sat.telemetry";
		},
		request: function(domainObject, options) {
			const name = parseNamespace(domainObject.identifier.namespace);
			const start_date = Math.floor(options.start),
						end_date = Math.floor(options.end);
			var url = `${urlBase}${name}.${domainObject.name}/${start_date}/${end_date}`;

			return http.httpGet(url).then(function(resp) {
				if (resp.data.length === 0) {
					url = `${urlBase}${name}.${domainObject.name}/`;

					return http.httpGet(url).then(
						newResp => {
							let histData = newResp.data,
								lastData = [];

							if (histData.length != 0) {
								let first = histData[0].timestamp,
									last = histData[histData.length - 1].timestamp;
								openmct.time.bounds({ start: first, end: last });
								lastData = histData;
							}

							return lastData;
						},
						err => {
							return [];
						}
					);
				} else return resp.data;
			});
		}
	};
}

function parseNamespace(namespace) {
	return namespace.replace(".telemetry", "");
}

