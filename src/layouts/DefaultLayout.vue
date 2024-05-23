<template>
	<div id="default">
		<router-view class="container view"></router-view>
	</div>
</template>

<script>
export default {
	name: "DefaultLayout",
}
</script>

<style scoped>
.view {
	min-height: 75vh;
}
</style>