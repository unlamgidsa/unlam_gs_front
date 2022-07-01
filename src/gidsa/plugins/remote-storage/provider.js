import * as Arrays from '../../utils/arrays';
import * as Constants from '../../utils/constants';

export default class RemoteStorageProvider {
	constructor(storageService, loginService, spaceKey = 'mct') {
		this.localStorage = window.localStorage;
		this.spaceKey = spaceKey;
		this.storageService = storageService;
		this.loginService = loginService;
		this.initialize();
	}

	get(identifier) {
		if (this.getSpaceAsObject()[identifier.key] !== undefined) {
			const persistedModel = this.getSpaceAsObject()[identifier.key];
			const domainObject = {
				identifier,
				...persistedModel
			};

			return Promise.resolve(domainObject);
		} else {
			return Promise.resolve(undefined);
		}
	}

	create(object) {
		console.log('create');
		return this.persistObject(object);
	}

	update(object) {
		console.log('update');
		return this.persistObject(object);
	}

	/**
	 * @private
	 */
	persistObject(domainObject) {
		let space = this.getSpaceAsObject();
		space[domainObject.identifier.key] = domainObject;

		this.persistSpace(space);

		return this.saveLocalToRemote().catch(err => {
			console.error('Ha ocurrido un error al grabar en remoto', err);
			return Promise.resolve(true);
		});
	}

	/**
	 * @private
	 */
	persistSpace(space) {
		this.localStorage[this.spaceKey] = JSON.stringify(space);
	}

	/**
	 * @private
	 */
	getSpace() {
		return this.localStorage[this.spaceKey];
	}

	/**
	 * @private
	 */
	getSpaceAsObject() {
		return JSON.parse(this.getSpace());
	}

	/**
	 * @private
	 */
	async initialize() {
		if (this.isEmpty()) {
			this.localStorage[this.spaceKey] = JSON.stringify({});
		}

		// Merge de items de remoto con local
		const userItems = await this.storageService.GetUserItems()
		const localItems = this.getSpaceAsObject();
		const merge = { ...localItems, ...userItems };
		if ( merge.mine && localItems.mine && userItems.mine )
			merge.mine.composition = Arrays.unique([...localItems.mine.composition, ...userItems.mine.composition]);

		this.persistSpace(merge)

		if ( localItems.mine && userItems.mine && localItems.mine.composition.length != userItems.mine.composition.length )
			window.location.reload();

		this.saveLocalToRemote()
	}

	async saveLocalToRemote() {
		const saveAuth = this.loginService.GetUser().username !== Constants.AnonymUsername;
		if ( saveAuth ) {
			const localItemsJson = this.getSpace();
			return this.storageService.Save(localItemsJson);
		}
		return Promise.resolve(true);
	}

	/**
	 * @private
	 */
	isEmpty() {
		return this.getSpace() === undefined;
	}
}
