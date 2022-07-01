define([
	'../../utils/constants',
	'./provider',
], function(
	Constants,
	RemoteStorageProvider,
) {
	function RemoteStorage(storageService, loginService) {
		return async (openmctApi) => {
			const provider = new RemoteStorageProvider.default(storageService, loginService, 'mct');
			openmctApi.objects.addProvider('', provider);
		}
	}


	return RemoteStorage;
})
