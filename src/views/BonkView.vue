<template>
	<section id="home" class="mt-3 animate__animated animate__fadeIn text-center container">

		<h1 class="my-5">GET BONKED</h1>

		<img alt="" :src="`https://bonk-api.fluxbeam.xyz/bonks/${$route.params.id}.gif`" class="m-auto mb-5 logo">

	</section>
</template>

<script>
export default {
	name: "BonkView"
}
</script>

<style scoped>

</style>