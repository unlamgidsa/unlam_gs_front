import LoginForm from "./loginForm.vue";
import Vue from "vue";
import * as http from "../../UNLaM-plugins/http-server/service.js";

export default function showForm(openmct) {
	let formElement = new Vue({
		provide: { openmct },
		components: { LoginForm },
		template: "<LoginForm></LoginForm>"
	}).$mount().$el;
	openmct.overlays.overlay({
		element: formElement,
		size: "fit"
	});
}
