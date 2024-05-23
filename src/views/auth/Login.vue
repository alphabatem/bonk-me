<template>
	<div class="container text-center my-5">
		<h1 class="mb-0">Connect Wallet</h1>
		<p class="mb-5">You need to connect your wallet to continue</p>
		<MultiWallet v-if="isDevice()" @connected="onWalletConnect" class="mt-1 animate__animated animate__fadeIn d-flex d-lg-none justify-content-center"></MultiWallet>
	</div>
</template>

<script>
import MultiWallet from "@/components/wallet/MultiWallet.vue";

export default {
	name: "Login",
	components: {MultiWallet},
	methods:{

		onWalletConnect: function () {
			console.log("AuthLayout::onWalletConnect")
			if (!this.$store.state.wallet.connected)
				return
			this.$store.dispatch("cache/refreshUserBalance");
			this.$router.push("/app/swap")
		},
		isDevice: function () {
			return window.innerWidth < 992
		}
	}
}
</script>

<style scoped>

</style>