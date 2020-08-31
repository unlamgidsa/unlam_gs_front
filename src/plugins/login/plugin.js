define([
	'./components/globalLoginIndicator.vue',
	'./loginAction',
	'vue',
], function (
	GlobalLoginIndicator,
	LoginAction,
	Vue,
) {
	return function plugin(appliesToObjects) {

		return function install(openmct) {

			let component = new Vue ({
				provide: {
					openmct
				},
				components: {
					GlobalLoginIndicator:GlobalLoginIndicator.default
				},
				template: '<GlobalLoginIndicator></GlobalLoginIndicator>'
			}),
				loginIndicator = {
					element: component.$mount().$el
				};

			openmct.indicators.add(loginIndicator);

			//openmct.contextMenu.registerAction(new LoginAction.default(openmct, appliesToObjects));
		};
	};
});
