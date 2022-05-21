define([], function(){
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
		const usr = JSON.parse(localStorage.getItem(USR_DATA));
		if ( !usr || !usr.username || !usr.token )
			throw new Error('no user is logged in');
		return usr;
	}

	/**
	 * Realiza el login in.
	 * @param {string} username el nombre de usuario que quiere iniciar sesion. Por defecto: 'anonym'
	 * @param {string} password la password con la cual iniciar sesion. Por defecto, 'anonym'.
	 * @return {Promise} una promise con el token.
	 */
	LoginService.prototype.Login = function(username = 'anonym', password = 'anonym') {
		// Si el usuario ya se encuentra loggeado, entonces no hace falta realizar el post
		if ( this.isUserLoggedIn(username) )
			return new Promise(resolve => resolve(this.Token()));

		return this.http.Post(this.entryPoint, {username, password})
			.then(res => res.token)
			.then(token => {
				localStorage.setItem(USR_DATA, JSON.stringify({username, token}));
				return token;
			})
			.catch(err => {
				throw new Error(`error login in: ${err}. [username=${username}]`);
			});
	}

	/**
	 * Realiza el logout. Borra del localStorage el token.
	 */
	LoginService.prototype.Logout = function() {
		localStorage.removeItem(USR_DATA);
	}

	return LoginService;
});
