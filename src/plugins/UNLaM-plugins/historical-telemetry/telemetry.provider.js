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
		//firsttime: true,
		supportsRequest: function(domainObject) {
			return domainObject.type === "sat.telemetry";
		},
		request: function(domainObject, options) {
			const name = parseNamespace(domainObject.identifier.namespace);
			const start_date = Math.floor(options.start);
			const end_date   = Math.floor(options.end);

			var url = `${urlBase}${name}.${domainObject.name}/${start_date}/${end_date}`;
				//debugger;
				return http.httpGet(url).then(function(resp) {
					return resp.data;
				}).catch(function(Error){
					console.error("Error trying to fetch data", Error);
				});
		}
	};
}

function parseNamespace(namespace) {
	return namespace.replace(".telemetry", "");
}

