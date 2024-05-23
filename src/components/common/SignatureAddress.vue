<template>
	<span>
    <a target="_blank" :href="link()" @click="onClick" class="w-full overflow-anywhere">
	{{ shortAddress }}
    </a>
    <i
			v-if="!copyLoading"
			@click="copy"
			class="copy bi-copy ml-2 text-secondary cursor-pointer"
		></i>
    <i
			v-if="copyLoading"
			class="bi-check-circle-fill ml-2 text-secondary text-success"
		></i>
  </span>
</template>

<script>
export default {
	name: "SignatureAddress",
	props: {
		address: {
			required: true
		},
		full: {
			type: Boolean
		}
	},
	data() {
		return {
			copyLoading: false,
		};
	},
	computed: {
		shortAddress: function () {
			if (this.full)
				return this.address.toString()

			if (!this.address)
				return ""

			const stra = this.address.toString()
			return `${stra.substr(0, 4)}...${stra.substr(-4)}`
		},
	},
	methods: {
		async copy() {
			this.copyLoading = true;
			await navigator.clipboard.writeText(this.address);
			setTimeout(() => {
				this.copyLoading = false;
			}, 1000);
		},
		onClick: function (e) {
			e.stopPropagation();
		},
		link: function () {
			return `${this.$store.state.settings.explorer}/tx/${this.address}?${this.$store.getters["settings/clusterQuery"]}`
		}
	}
}
</script>

<style scoped>
.text-theme a,
.text-theme .copy {
	color: rgb(var(--theme500)) !important;
}
.overflow-anywhere{
	overflow-wrap: anywhere;
}
</style>