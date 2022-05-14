define([], function(){
	return class Http {
		constructor() {}

		setToken(token) {
			this._token = token;
		}

		/**
		 * Realiza un HTTP GET.
		 * @param {string} url la url a golpear.
		 * @return {Promise} Promise cuyo valor tiene el objeto recibido del backend.
		 */
		get(url) {
			const headers = this._headers();
			return this._doFetch(url, 'GET', headers);
		}

		/**
		 * Realiza un HTTP POST.
		 * @param {string} url la url a golpear.
		 * @param {*} data los datos a enviar en el body.
		 * @return {Promise} Promise cuyo valor tiene el objeto recibido del backend.
		 */
		post(url, data) {
			const headers = this._headers();
			const body = JSON.stringify(data);
			return this._doFetch(url, 'POST', headers, body);
		}

		/**
		 * Obtiene los headers a utilizar en las consultas.
		 * @param {string?} token es el token a utilizar como 'Authorization'. Si no se
		 *                        pasa el parametro, entonces no se agrega el header 'Authorization'.
		 */
		_headers() {
			const headers = {
				'Content-Type': 'application/json',
			};

			if ( this._token )
				headers['Authorization'] = `Token ${this._token}`;

			return headers;
		}

		/**
		 * Funcion utilitaria que realiza el fetch tanto para GET como para POST.
		 * @param {string} url la url a la cual realizar el fetch.
		 * @param {'GET' | 'POST'} method el metodo HTTP a utilizar.
		 * @param {*} headers los headers a utilizar en la llamada.
		 * @param {string?} body el cuerpo a utilizar para 'POST'. Puede no enviarse.
		 * @return {Promise} Promise cuyo valor tiene el objeto recibido del backend.
		 */
		_doFetch(url, method, headers, body) {
			return fetch(url, { method, headers, body }).then(res => {
				if ( res.status != 200 ) {
					throw new Error(`Error in ${method}. Status = ${res.status}.Response = ${res.statusText}.`
						+ `[url=${url}, headers=${headers}, body=${body}]`);
				}

				return res.json();
			});
		}
	}
});

