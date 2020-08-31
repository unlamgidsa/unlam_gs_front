export default class LoginAction {
    constructor(openmct, appliesToObjects) {
        this.name = 'Change current user';
        this.description = 'Change current user';
        this.cssClass = 'icon-clear-data';

        this._openmct = openmct;
        this._appliesToObjects = appliesToObjects;
    }
    invoke(objectPath) {
        this._openmct.objectViews.emit('login', objectPath[0]);
        console.log("Login press");
    }
    appliesTo(objectPath) {
			return this._appliesToObjects.includes(objectPath[0].type);
    }
}
