<template>
	<div>{{ name }}</div>
</template>

<script>
export default {
	data: function() {
		return {
			name: 'Hello from Vue'
		}
	}
}
</script>

<style scoped>
div {
	background-color: #ccc;
}
</style>
