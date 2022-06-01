import Vue from 'vue';
import * as LoginConstants from './constants';
import { EventBus } from './event-bus';

const formTemplate = `
<div>
	<div class="c-overlay__top-bar">
		<h1 class="c-overlay__dialog-title">Log In</h1>
	</div>
	<form @submit.prevent="onSubmit">
		<label class="med" for="username">Username</label><br/>
		<input type="text" v-model="username"><br/><br/>

		<label for="password">Password</label><br/>
		<input type="password" v-model="password"><br/><br/>

		<button type="submit" class="c-button c-button--major">Log In</button>
	</form>
</div>
`;

const defaultData = () => ({
	username: '',
	password: '',
});

export function ShowForm(openmctApi, loginService) {
	let overlay;

	const methods = {
		async onSubmit() {
			try {
				await loginService.Login(this.username, this.password)
				EventBus.$emit(LoginConstants.LoginEvent, this.username);
				overlay.dismiss();
			} catch ( err ) {
				window.alert("An error occurred while login in: " + err);
			}
		}
	};
	const onMount = function() {
		EventBus.$on(LoginConstants.LogoutEvent, usr => this.username = usr);
	};

	const FormComponent = Vue.component('login-form', {
		template: formTemplate,
		methods,
		data: defaultData,
		mounted: onMount,
	});
	const formElement = new FormComponent().$mount().$el;
	overlay = openmctApi.overlays.overlay({
		element: formElement,
		size: 'fit',
	});
}
