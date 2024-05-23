<template>
	<section id="home" class="mt-3 animate__animated animate__fadeIn text-center container">

		<h1 class="mb-5">Bonk Me</h1>

		<img alt="Bonk" v-if="!loading" src="/logo.png" class="m-auto mb-5 logo">
		<img :alt="form.handle" v-else :src="`https://unavatar.io/${form.handle}`" class="m-auto mb-5 logo">



		<div class="card" v-if="!$store.state.wallet.connected">
			<div class="card-body">
				<h5 class="my-5">Connect wallet to start bonking.</h5>
			</div>
		</div>
		<div class="card" v-else-if="!result">
			<div class="card-body">
				<h4 class="mb-3">Enter in a X handle to give them a good Bonking</h4>

				<form class="form text-center" @submit="onBonk">
					<input v-model="form.handle" class="form-control mb-3" placeholder="Enter X handle">
					<button :disabled="form.handle.length < 3" class="btn btn-primary" type="submit">Bonk Me Daddy ({{payCost}} {{form.payMethod}})</button>
				</form>
			</div>
		</div>
		<div class="card" v-else>
			<div class="card-body">
				<h4 class="mb-3">You Bonked {{ form.handle }}!</h4>

				<a target="_blank" :href="`https://solscan.io/tx/${result.sig}`" class="mb-3 d-block"><code>{{result.sig}}</code></a>

				<a target="_blank" :href="shareURI()" class="btn btn-primary">Share on X</a>
				<button @click="reset" class="btn btn-primary ms-4">Bonk Again</button>
			</div>
		</div>

		<footer class="mt-5">
			<a href="https://jup.ag/swap/SOL-Bonk" target="_blank">BUY BONK</a>

			<div class="pay-method float-end text-start">
				<span class="small me-2">Pay In:</span>
				<button @click="togglePayMethod" :class="{'active': form.payMethod === 'BONK'}" class="btn btn-toggle btn-sm small p-1 py-0">BONK</button>
				<button @click="togglePayMethod" :class="{'active': form.payMethod === 'SOL'}" class="btn btn-toggle btn-sm small p-1 py-0">SOL</button>
			</div>
		</footer>
	</section>
</template>

<script>

import SignatureLoader from "@/mixins/SignatureLoader";
import {web3} from "@project-serum/anchor";
import {createTransferCheckedInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID} from "@solana/spl-token";

export default {
	name: "HomeView",
	mixins: [SignatureLoader],
	data() {
		return {
			form: {
				handle: "",
				payMethod: 'BONK'
			},
			loading: false,
			result: null,
			bonkCost: 1_000,
			solCost: 0.02
		};
	},
	computed: {
		payCost: function() {
			if(this.form.payMethod === "SOL")
				return this.solCost
			else
				return this.bonkCost
		}
	},
	methods: {
		reset: function () {
			this.loading = false
			this.result = {}
		},

		togglePayMethod: async function (e) {
			e.preventDefault()
			if(this.form.payMethod === "SOL")
				this.form.payMethod = "BONK"
			else
				this.form.payMethod = "SOL"
		},

		onBonk: async function (e) {
			e.preventDefault()
			this.loading = true

			this.$toastr.s(`Finding ${this.form.handle}...`)

			const src = new web3.PublicKey(this.$store.state.wallet.address)
			const dst = new web3.PublicKey("2wci94quHBAAVt1HC4T5SUerZR7699LMb8Ueh3CSVpTX") //Cloakd.sol



			console.log(`${src} -> ${dst}`)

			//Build Txn
			const txn = new web3.Transaction();

			if (this.form.payMethod === "SOL") {
				const amount = this.solCost * Math.pow(10,9)

				txn.add(web3.SystemProgram.transfer({
					fromPubkey: src,
					toPubkey: dst,
					lamports: amount * Math.pow(10, 9),
				}))
			} else {
				const amount = this.bonkCost * Math.pow(10,5)

				const mint = new web3.PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
				const srcAta = getAssociatedTokenAddressSync(mint, src, false, TOKEN_PROGRAM_ID)
				const dstAta = getAssociatedTokenAddressSync(mint, dst, false, TOKEN_PROGRAM_ID)

				txn.add(createTransferCheckedInstruction(
					srcAta, //Src Ata
					mint, //Mint
					dstAta,
					src,
					amount,
					5,
					[],
					TOKEN_PROGRAM_ID
				))
			}

			const sig = await this.signAndSendTransaction(txn, "bonk_me", [])

			this.$toastr.s(`Bonking ${this.form.handle}...`)

			await this.$store.state.solana.client.confirmTransaction(
				sig,
				"confirmed"
			);

			this.$toastr.s(`Successfully Bonked ${this.form.handle}...`)
			this.result = {
				sig: sig
			}

			//

		},

		shareURI: function () {
			const uri = "https://bonk-me.netlify.app%0A%0A"
			const text = `I just bonked @${this.form.handle} on BonkMe!%0A%0A
			You can bonk others too:`

			return `https://twitter.com/share?text=${text}&url=${uri}&hashtags=bonkMe,bonk`
		}
	},
};
</script>

<style scoped>
a {
	text-decoration: none;
}

.logo {
	height: 200px;
	border-radius: 14px;
	border: 3px solid white;
}

</style>
