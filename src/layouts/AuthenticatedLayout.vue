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
			loading: true,
			loadingWhat: "",

			li: 0,
			loadingInterval: null,

			interval: null
		}
	},
	methods: {
		startLoading: function() {
			this.loadingWhat = "Loading Site"
			this.loadingInterval = setInterval(() => {
				const arr = [
					"Fetching Tokens",
					"Fetching Pools",
					"Checking Liquidity",
					"Optimizing Routes",
				]
				const lx = this.li
				this.loadingWhat = arr[lx] || ""
				if (this.li <= arr.length)
					this.li++
			}, 1600)
		},
		getPreviewTokens: async function () {
			this.startLoading()

			this.$store.state.solana.fluxClient.getPoolTokensIndexPage(0, 250).then(r => {
				this.$store.commit('cache/set_token_list', r)
			}).catch(e => {
				console.error(e)
				this.$toastr.e("Unable to load token list")
			}).finally(() => {
				this.loading = false
				clearInterval(this.loadingInterval)
			})
		},
	},
	mounted() {
		// this.getPoolMatrix()
		this.getPreviewTokens()
		// this.getAllTokens()
	},
}
</script>

<style scoped>
</style>