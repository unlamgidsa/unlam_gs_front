import * as http from "../UNLaM-plugins/http-server/service.js";

export function getUserData() {
	let user = JSON.parse(localStorage.getItem("userData"));
	if (user == null) {
		localStorage.setItem("userData", JSON.stringify({}));	
		user = {};
	}
	return user;
}

export function getAndSetToken(username, password) {
	return http
		.httpPost(urlBase + "api-token-auth/", { username, password })
		.then(resp => {
			const token = resp.data.token;
			localStorage.setItem("userData", JSON.stringify({ username, token }));
		});
}

export function logOut() {
	localStorage.setItem("userData", JSON.stringify({}));
}

export function isUserLoggedIn() {
	let user = JSON.parse(localStorage.getItem("userData"));
	return (
		user != null &&
		user.hasOwnProperty("username") &&
		typeof user.username === "string" &&
		user.hasOwnProperty("token")
	);
}

export function isUserAnonym() {
	let user = JSON.parse(localStorage.getItem("userData"));
	return user.username != "anonym";
}

export function logAnonymUser() {
	return getAndSetToken("anonym", "anonym");
}
