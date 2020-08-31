define([
	"./src/LocalStoragePersistenceProvider",
	"./src/LocalStorageIndicator"
], function (
	LocalStoragePersistenceProvider,
	LocalStorageIndicator
) {

	return {
		name:"src/plugins/UNLaM-plugins/LRStorage",
		definition: {
			"name": "Local and remote storage",
			"description": "Adapter to read and write domain objects using an API",
			"extensions": {
				"components": [
					{
						"provides": "persistenceService",
						"type": "provider",
						"implementation": LocalStoragePersistenceProvider,
						"depends": [
							"$window",
							"$q",
							"$http",
							"PERSISTENCE_SPACE",
							"STORE_PATH"
						]
					}
				],
				"constants": [
					{
						"key": "PERSISTENCE_SPACE",
						"value": "mct"
					},
					{
						"key": "STORE_PATH",
						"value": "API/store"
					}
				],
				"indicators": [
					{
						"implementation": LocalStorageIndicator
					}
				]
			}
		}
	};
});
