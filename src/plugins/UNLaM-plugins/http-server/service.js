import axios from "axios";
import { getUserData } from "../../login/login-functions";

export function httpGet(url) {
	let user = getUserData();
	if (user.hasOwnProperty("token") && user.token != null)
		return axios.get(url, { headers: { Authorization: "Token " + user.token }});
	else
		throw "Trying to http.get without a token";
}

export function httpPost(url, data) {
	let user = getUserData();
	return axios.post(url, data, { headers: { Authorization: "Token " + user.token }});
}

export function httpPut(url, data) {
	let user = getUserData();
	return axios.put(url, data, { headers: { Authorization: "Token " + user.token }});
}
