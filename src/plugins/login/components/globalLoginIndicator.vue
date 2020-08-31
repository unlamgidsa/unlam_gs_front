<template>
	<div class="c-indicator c-indicator--clickable icon-person s-status-caution">
		<span class="label c-indicator__label">
			<div v-if="isLogged">
				<span> {{ username }} </span>
				<button
					class="icon-x"
					style="margin: auto;"
					@click="initLogOut"
				></button>
			</div>
			<button v-else @click="globalLoginEmit">Change user</button>
		</span>
	</div>
</template>

<script>
import showForm from "../form/form.js";
import { getAndSetToken, logOut, isUserLoggedIn, logAnonymUser, getUserData } from "../login-functions.js";
import { EventBus } from "../event-bus.js";

export default {
	inject: ["openmct"],
	methods: {
		globalLoginEmit() {
			showForm(openmct);
		},
		initLogOut() {
			this.isLogged = false;
			this.username = "Change user";
			logOut();
			EventBus.$emit("logout", "");
		}
	},
	data() {
		return {
			username: "Change user",
			isLogged: false
		};
	},
	mounted() {
		let user = getUserData();
		if (isUserLoggedIn()) {
			this.username = user.username;
			this.isLogged = true;
		} else {
			logAnonymUser()
				.then(resp => {
					window.location.reload(false);
				})
				.catch(err => {
					logOut();
				});
		}
		EventBus.$on("login", usr => {
			this.username = usr;
			this.isLogged = true;
		});
	}
};
</script>
