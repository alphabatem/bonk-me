<template>
	<div id="app" class="mb-2">
		<BonkBar></BonkBar>
		<Navbar></Navbar>
		<div v-if="this.$store.state.settings.customRpcUrl.indexOf('devnet') > -1" class="w-100 mb-0 alert alert-warning p-0 warning">Devnet Mode</div>
		<router-view class="view"></router-view>
		<portal-target name="body"></portal-target>
		<Loader v-if="$store.state.cache.loading"></Loader>
	</div>
</template>

<script>

import Navbar from "@/components/Navbar.vue";
import Loader from "@/components/common/Loader.vue";
import BonkBar from "@/components/BonkBar.vue";

export default {
	name: 'App',
	components: {BonkBar, Loader, Navbar},
	computed: {
		isBot: function() {
			return this.$route.path.indexOf("/bot") > -1
		}
	},
	beforeMount() {
		this.$store.commit("solana/set_endpoint", this.$store.state.rpc.rpcUrl)
		this.$store.dispatch("solana/fetchClusterFees")
	}
}
</script>

<style>
.warning {
	text-align: center;
	border-radius: 0;
	border-left: none !important;
	border-right: none !important;
}
</style>
