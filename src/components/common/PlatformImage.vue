<template>
	<div class="d-inline-block platform-img me-2" :class="{'lg': large, 'sm': small}">
		<img :src="getSrc()" alt="" loading="lazy" onload="this.style.opacity=1">
	</div>
</template>

<script>
export default {
	name: "PlatformImage",
	props: {
		platform: {
			type: Number,
			required: true
		},
		backup: {
			type: String,
		},
		large: {
			type: Boolean,
		},
		small: {
			type: Boolean,
		}
	},
	data() {
		return{
			metadata: {}
		}
	},
	methods: {
		getData: async function() {
			if (this.$store.state.cache.tokenMap[this.mint?.toString()]) {
				this.metadata = this.$store.state.cache.tokenMap[this.mint?.toString()]
				return
			}

			try {
				const resp = await fetch(`https://api.degencdn.com/v1/nfts/${this.mint?.toString()}`)
				this.metadata = await resp.json()
			} catch (e) {
				this.metadata = {
					name: "Unknown",
					symbol: "Unknown",
					image: null
				}
			}

		},
		getSrc: function () {
			switch (this.platform) {
				case 0:
					return "/images/amms/fluxbeam.png"
				case 1:
					return "/images/amms/fluxbeam.png"
				case 2:
					return "/images/amms/fluxbeam.png"
				case 3:
					return "/images/amms/jupiter.png"
			}
		},
	},
	mounted() {
		this.getData()
	}
}
</script>

<style scoped>
img {
	height: 38px;
	width: 38px;
	opacity: 0;
	transition: opacity 0.3s linear;
	border-radius: 100%;
}

.sm img {
	height: 24px;
	width: 24px;
}

.lg img {
	height: 128px;
	width: 128px;
}
</style>