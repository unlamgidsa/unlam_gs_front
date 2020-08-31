import SatelliteView from "./satellite-view.vue";
import Vue from "vue";

export function ObjectView(openmct) {
	openmct.objectViews.addProvider({
		name: "sat-view",
		key: "sat-view",
		cssClass: "icon-packet",
		canView: function(d) {
			return d.type === "satellite";
		},
		view: function(domainObject) {
			var vm;
			return {
				show: function(container) {
					vm = new Vue({
						provide: {
							domainObject,
							openmct
						},
						components: {
							SatelliteView: SatelliteView
						},
						template: '<SatelliteView></SatelliteView>'
					});
					container.appendChild(vm.$mount().$el);
				},
				destroy: function(container) {
					vm.$destroy();
				}
			};
		}
	});
}
