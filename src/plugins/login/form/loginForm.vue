<template>
	<div>
		<div class="c-overlay__top-bar">
			<h1 class="c-overlay__dialog-title">Log In</h1>
		</div>
		<form @submit.prevent="onSubmit">
			<label class="med" for="username">Username</label><br />
			<input type="text" v-model="username" /><br /><br />
			<label for="password">Password</label><br />
			<input type="password" v-model="password" /><br /><br />
			<button type="submit" class="c-button c-button--major">Log in</button>
		</form>
	</div>
</template>

<script>
import { EventBus } from "../event-bus.js";
import { getAndSetToken, logOut } from "../login-functions.js";
export default {
	inject: ["openmct"],
	data() {
		return {
			username: "",
			password: ""
		};
	},
	methods: {
		onSubmit() {
			getAndSetToken(this.username, this.password).then(
				resp => {
					EventBus.$emit("login", this.username);
					openmct.overlays.dismissLastOverlay();
					window.location.reload(false);
				},
				err => {
					logOut();
					window.alert(
						"Hubo un problema al iniciar sesión. Usuario y/o contraseña errónea"
					);
				}
			);
		}
	},
	mounted() {
		EventBus.$on("logout", usr => {
			this.username = usr;
			logOut();
		});
	}
};
</script>
