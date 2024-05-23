<template>
	<div id="default">
		<router-view class="container view"></router-view>
		<SignatureStatusModal></SignatureStatusModal>
	</div>
</template>

<script>
import SignatureStatusModal from "@/components/transaction/SignatureStatusModal.vue";

export default {
	name: "DefaultLayout",
	components: {SignatureStatusModal},
}
</script>

<style scoped>
.view {
	min-height: 75vh;
}
</style>