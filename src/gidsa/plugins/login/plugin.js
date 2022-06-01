define([
	'vue',
	'./event-bus',
	'./constants',
	'./form',
], function(
	Vue,
	EventBusPkg,
	LoginConstants,
	FormComponent,
) {
	const EventBus = EventBusPkg.EventBus;
	const indicatorTemplate = `
<div class="c-indicator c-indicator--clickable icon-person s-status-caution">
	<span class="label c-indicator__label">
		<div v-if="isUserLoggedIn">
			<span>{{username}}</span>
			<button class="icon-x" style="margin: auto;" @click="onLogoutClick"></button>
		</div>
		<button v-else @click="onLoginClick">Change user</button>
	</span>
</div>
	`;
	const defaultData = () => ({
		username: 'Change user',
		isUserLoggedIn: false,
	});

	function Login(loginService) {
		const onMount = function() {
			const user = loginService.GetUser();
			this.username = user.username;
			this.isUserLoggedIn = true;

			EventBus.$on(LoginConstants.LoginEvent, usr => {
				this.username = usr;
				this.isUserLoggedIn = true;
			});
		};

		return function install(openmctApi) {
			const methods = {
				onLoginClick() {
					FormComponent.ShowForm(openmctApi, loginService);
				},
				onLogoutClick() {
					this.isUserLoggedIn = false;
					this.username = 'Change user';
					loginService.Logout();
					EventBus.$emit(LoginConstants.LogoutEvent, '');
				},
			};
			const LoginComponent = Vue.component('login-indicator', {
				template: indicatorTemplate,
				methods,
				data: defaultData,
				mounted: onMount,
			});
			const loginIndicator = { element: new LoginComponent().$mount().$el }

			openmctApi.indicators.add(loginIndicator);
		};
	};

	return Login;
});
