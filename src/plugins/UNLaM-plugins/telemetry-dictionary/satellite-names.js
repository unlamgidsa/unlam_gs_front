import * as http from "../http-server/service.js";

export default async function SatelliteNames(url) {
	return http.httpGet(url).then(response => {
		return response.data.map(satellite => {
			return { name: satellite.code, key: "satellite" };
		});
	});
	
}
