import Vue from 'vue';
import NewSatellite from './NewSatellite.vue';

export default function NewSatellitePlugin() {
  return function install(openmct) {
    openmct.types.addType('new-satellite', {
      name: 'Create new satellite',
      description: 'A way to create a satellite instance from webApp',
      cssClass: 'icon-pencil',
      creatable: false
    });
    openmct.objects.addRoot({
      namespace: 'new-satellite',
      key: 'new-satellite'
    });
    openmct.objects.addProvider('new-satellite', {
      get: function(identifier) {
				return new Promise(function(resolve, reject) {
					resolve({
						identifier: identifier,
						name: 'Create new satellite',
						type: 'new-satellite',
						location: 'ROOT'
					});
				});
      }
    });
    openmct.objectViews.addProvider({
      name: 'new-sat-interface',
      key: 'new-sat',
      cssClass: 'icon-object',
      canView: function(object) {
        return object.type === 'new-satellite';
      },
      view: function(domainObject) {
        var vm;
        return {
          show: function(container) {
            vm = new Vue(NewSatellite);
            container.appendChild(vm.$mount().$el);
          },
          destroy: function(container) {
            vm.$destroy();
          }
        };
      }
    });
  };
}
