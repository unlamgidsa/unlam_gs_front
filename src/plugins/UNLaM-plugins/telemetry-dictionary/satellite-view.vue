<template>
	<div>
	<h1>{{ domainObject.name }}</h1>
	<img src="http://spacebillboard.com/sites/all/themes/sbbtheme/resources/img/meta/cubesat.jpg" alt="" width="100%">
	</div>
</template>

<script>
export default {
	inject: ["domainObject", "openmct"],
	data () {
		return {
			msg: 'Hello world!'
		}
	}
}
</script>

<style>
</style>
