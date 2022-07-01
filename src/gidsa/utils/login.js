define([
	'./constants',
], function(
	Constants,
){
	const USR_DATA = 'userData';

	function LoginService(entryPoint, http) {
		this.entryPoint = entryPoint;
		this.http = http;
	}

	/**
	 * @return {boolean} si hay usuario loggeado o no, esto es, si hay usuario en localStorage.
	 */
	LoginService.prototype.isUserLoggedIn = function(username) {
		const usr = JSON.parse(localStorage.getItem(USR_DATA));
		return usr && usr.username == username && usr.token;
	}

	/**
	 * Obtiene el token guardado en localStorage.
	 * Precondicion: debe haber un usuario loggeado, esto es, un usuario guardado en localStorage.
	 * @return {string} el token del usuario.
	 * @throws {Error} en caso de que no haya ningun usuario loggeado, lanza un error.
	 */
	LoginService.prototype.Token = function() {
		const usr = this.GetUser();
		return usr.token;
	}

	/**
	 * @return {{username: string, token: string}}
	 */
	LoginService.prototype.GetUser = function() {
		const usr = this.parseUser();
		if ( !usr || !usr.username || !usr.token )
			throw new Error('no user is logged in');
		return usr;
	}

	LoginService.prototype.parseUser = function() {
		return JSON.parse(localStorage.getItem(USR_DATA));
	}

	LoginService.prototype.AutoLogin = function() {
		const usr = this.parseUser();
		let username;
		if ( usr && usr.username )
			username = usr.username;
		return this.Login(username);
	}

	/**
	 * Realiza el login in.
	 * @param {string} username el nombre de usuario que quiere iniciar sesion. Por defecto: 'anonym'
	 * @param {string} password la password con la cual iniciar sesion. Por defecto, 'anonym'.
	 * @return {Promise} una promise con el token.
	 */
	LoginService.prototype.Login = function(
		username = Constants.AnonymUsername,
		password = Constants.AnonymPassword,
	) {
		let retPromise;
		// Si el usuario ya se encuentra loggeado, entonces no hace falta realizar el post
		if ( this.isUserLoggedIn(username) ) {
			retPromise = new Promise(resolve => resolve(this.Token()));
		} else {
			retPromise = this.http.Post(this.entryPoint, {username, password})
				.then(res => res.token)
				.then(token => {
					localStorage.setItem(USR_DATA, JSON.stringify({username, token}));
					return token;
				})
				.catch(err => {
					throw new Error(`error login in: ${err}. [username=${username}]`);
				});
		}

		return retPromise.then(token => {
			this.http.SetToken(token);
			return token;
		});
	}

	/**
	 * Realiza el logout. Borra del localStorage el token.
	 */
	LoginService.prototype.Logout = function() {
		localStorage.removeItem(USR_DATA);
		this.http.SetToken()
	}

	return LoginService;
});
