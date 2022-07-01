define([], function() {
	const userItemsEntry = 'UserItems';
	const saveEntry = `${userItemsEntry}/Create`;

	function StorageService(url, http) {
		this.url = url;
		this.http = http;
	}

	StorageService.prototype.GetUserItems = async function() {
		const url = `${this.url}/${userItemsEntry}`;
		return this.http.Get(url).then(res => {
			if ( res && res.length > 0 )
				return JSON.parse(res);
			return undefined;
		});
	}

	StorageService.prototype.Save = async function(userItems) {
		const url = `${this.url}/${saveEntry}`;
		return this.http.Post(url, {jsonf: userItems});
	}

	return StorageService;
});
