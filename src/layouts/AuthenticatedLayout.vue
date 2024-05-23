<template>
	<div id="default">
		<Login v-if="!$store.state.wallet.connected"></Login>
		<div v-else-if="loading" class="mt-5 pt-5 text-center">
			<h1 class="animate__animated animate__fadeIn">LOADING</h1>

			<h3 :key="loadingWhat" class="mt-5 animate__animated animate__fadeIn">{{ loadingWhat }}</h3>
		</div>
		<div class="authenticated" v-else>
			<transition name="fade" mode="out-in">
				<router-view :key="address" class="container view"></router-view>
			</transition>
			<SignatureStatusModal></SignatureStatusModal>
			<Disclaimer></Disclaimer>
		</div>
	</div>
</template>

<script>

import SignatureStatusModal from "@/components/transaction/SignatureStatusModal.vue";
import Disclaimer from "@/components/common/Disclaimer.vue";
import Login from "@/views/auth/Login.vue";

export default {
	name: "AuthenticatedLayout",
	components: {Login, Disclaimer, SignatureStatusModal},
	computed: {
		address: function () {
			return this.$store.state.wallet.address?.toString() || Math.random()
		}
	},
	data() {
		return {
			loading: false,
			loadingWhat: "",

			li: 0,
			loadingInterval: null,

			interval: null
		}
	},
	methods: {
	},
	mounted() {
	},
}
</script>

<style scoped>
</style>