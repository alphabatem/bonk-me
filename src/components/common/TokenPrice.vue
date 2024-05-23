<template>
	<span ref="price" class="token-price">{{ fmt.format(price) }}</span>
</template>

<script>
export default {
	name: "TokenPrice",
	props: {
		token: {
			// type: web3.PublicKey,
			required: true
		},
		amount: {
			default() {
				return 1
			}
		},
		maxDigits: {
			default() {
				return 11
			}
		},
		refresh: {
			default() {
				return -1
			}
		},
		flashUpdate: {
			default() {
				return false
			}
		}
	},
	watch:{
		token: function() {
			this.getPrice()
		}
	},
	data() {
		return {
			fmt: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: this.maxDigits}),
			tokenPrice: 0,
			lastTokenPrice: 0,
		}
	},
	computed: {
		usdPrice: function () {
			return this.tokenPrice;
		},

		price: function () {
			const amnt  = this.usdPrice * this.amount
			return amnt > 0.1 ? amnt.toFixed(2) : amnt || 0
		},
	},
	methods: {
		getPrice: async function () {
			if (this.token.toString() === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {  //USDC
				this.tokenPrice = 1
				return
			}

			const cachedPrice = this.$store.getters.tokenPrice(this.token)
			if (cachedPrice) {
				// console.log("Cache Hit", this.token.toString(), cachedPrice)
				this.tokenPrice = cachedPrice
				return
			}

			//Not found in cache, getting
			// console.log("Cache Miss", this.token.toString())
			await this.fetchPrice()
		},
		fetchPrice: async function() {
			this.$refs.price.classList.remove("flash")
			const resp = await fetch(`https://price.jup.ag/v4/price?ids=${this.token}`)
			const data = await resp.json()

			this.lastTokenPrice = this.tokenPrice
			this.tokenPrice = data.data[this.token]?.price
			this.$store.commit("cache/set_token_price", {mint: this.token, price: this.tokenPrice})

			if (this.flashUpdate) {
				if (this.tokenPrice > this.lastTokenPrice) {
					this.$refs.price.classList.remove("red")
					this.$refs.price.classList.add("green")
				} else if (this.tokenPrice < this.lastTokenPrice) {
					this.$refs.price.classList.remove("green")
					this.$refs.price.classList.add("red")
				}
				this.$refs.price.classList.add("flash")
			}
		}
	},
	mounted() {
		this.getPrice()

		if (this.refresh > -1)
			this.interval = setInterval(() => this.fetchPrice(), this.refresh)
	},
	beforeDestroy() {
		clearInterval(this.interval)
	}
}
</script>

<style scoped>
</style>