<template>
	<span class="token-image" v-if="mint">
		<router-link v-if="link" class="d-inline-block text-decoration-none" :to="hideLink ? `` : `/app/tokens/${mint?.toString()}`">
		<div class="token-link">
			<div class="token-img-outer">
				<div class="token-img me-2" :class="{'lg': large, 'sm': small}">
					<img :src="getSrc()" alt="" loading="lazy" onload="this.style.opacity=1">
				</div>
				<sup v-if="getVerified()"><i class="fa fa-star" title="Verified token"></i></sup>
			</div>
			<div>
				<p v-if="showSymbol" class="mb-0">{{ getSymbol() }}</p>
				<p v-if="showName" class="mb-0 grey small text-decoration-none" style="font-size: 0.7rem">{{ getName() }}</p>
			</div>
		</div>
	</router-link>
		<div v-else class="token-link">
			<div class="token-img-outer">
				<div class="token-img me-2" :class="{'lg': large, 'sm': small}">
					<img :src="getSrc()" alt="" loading="lazy" onload="this.style.opacity=1">
				</div>
				<sup v-if="getVerified()"><i class="fa fa-star" title="Verified token"></i></sup>
			</div>
			<div>
				<p v-if="showSymbol" class="mb-0">{{ getSymbol() }}</p>
				<p v-if="showName" class="mb-0 grey small text-decoration-none" style="font-size: 0.7rem">{{ getName() }}</p>
			</div>
		</div>
	</span>
</template>

<script>
export default {
	name: "TokenImage",
	props: {
		mint: {
			required: true
		},
		backup: {
			type: String,
		},
		backupName: {
			type: String,
		},
		large: {
			type: Boolean,
		},
		small: {
			type: Boolean,
		},
		verified: {
			type: Boolean,
		},
		link: {
			type: Boolean,
			default() {
				return true
			}
		},
		hideLink: {
			type: Boolean,
		},
		showSymbol: {
			type: Boolean,
			default() {
				return true
			}
		},
		showName: {
			type: Boolean,
		}
	},
	data() {
		return {
			metadata: {}
		}
	},
	methods: {
		getData: async function () {
			if (this.$store.state.cache.tokenMap[this.mint?.toString()]) {
				this.metadata = this.$store.state.cache.tokenMap[this.mint?.toString()]
				return
			}

			if (!this.mint) {
				this.metadata = {
					name: "Unknown",
					symbol: "Unknown",
					image: null
				}
				return
			}

			try {
				const resp = await fetch(`https://api.degencdn.com/v1/nfts/${this.mint?.toString()}`)
				if (resp.status === 200) {
					this.metadata = await resp.json()
					this.$store.commit('cache/add_token', this.metadata);
				} else if(resp.status === 400) {
					this.$store.commit('cache/add_token', {
						"mint": this.mint?.toString(),
						"imageType": "jpg",
					})
				}
			} catch (e) {
				this.metadata = {
					name: "Unknown",
					symbol: "Unknown",
					image: null
				}
			}

		},

		getVerified: function () {
			return this.verified || this.metadata.verified || false
		},

		getSrc: function () {
			return this.metadata.image || this.backup || `https://api.degencdn.com/v1/nfts/${this.mint?.toString()}/image.jpg`
		},
		getSymbol: function () {
			return this.metadata?.symbol?.replace(/\0/g, "").substring(0,7) || ""
		},
		getName: function () {
			if (this.backupName) {
				return this.backupName
			}
			return this.metadata?.name?.replace(/\0/g, "") || ""
		}
	},
	mounted() {
		this.getData()
	}
}
</script>

<style scoped>
a {
	text-decoration: none;
}

.token-link {
	display: flex;
	align-items: center;
}

.token-img {
	border-radius: 100%;
	/*background: rgba(255, 255, 255, 0.1);*/
	display: inline-block;
	overflow: hidden;
	transition: filter 0.3s linear;

	height: 36px;
	width: 36px;
}

.token-img.lg {
	border-radius: 5px;
	height: 24px;
	width: 24px;
}

.token-img.sm {
	border-radius: 5px;
	height: 128px;
	width: 128px;
}

.token-img:hover {
	filter: brightness(1.5);
}

img {
	height: 38px;
	width: 38px;
	opacity: 0;
	transition: opacity 0.3s linear;
}

.sm img {
	height: 24px;
	width: 24px;
}

.lg img {
	height: 128px;
	width: 128px;
}

.token-img-outer {
	display: flex;
	position: relative;
}

sup {
	font-size: 0.5rem;
	color: var(--bs-primary);
}

sup {
	position: absolute;
	top: 0;
	right: 0.25rem;
}
</style>