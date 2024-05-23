<template>
	<section id="home" class="mt-3 animate__animated animate__fadeIn text-center container">

		<h1 class="mb-5">Bonk Me</h1>

		<img v-if="result?.id" :src="`${baseURI}/bonks/${result.id}.gif`" class="m-auto mb-5 logo">
		<img alt="Bonk" v-else-if="!loading" src="/logo.png" class="m-auto mb-5 logo">
		<img :alt="form.target" v-else :src="pfpUri" class="m-auto mb-5 logo">



		<div class="row">
			<div class="col-12 col-lg-8 m-lg-auto">
				<div class="card" v-if="!$store.state.wallet.connected">
					<div class="card-body px-5">
						<h5 class="my-5">Connect wallet to start bonking.</h5>
					</div>
				</div>
				<div class="card" v-else-if="loading">
					<div class="card-body px-5">
						<h5 class="my-5">Generating Result...</h5>
					</div>
				</div>
				<div class="card" v-else-if="!result">
					<div class="card-body px-5">
						<h4 class="mb-3">Enter in a X handle to give them a good Bonking</h4>

						<form class="form text-start" @submit="onBonk">


							<label>Target X (Twitter) Handle:</label>
							<input v-model="form.target" class="form-control mb-3" placeholder="Enter X handle">

							<label>Amount of times to Bonk:</label>
							<input v-model.number="form.hits" type="number" min="1" class="form-control mb-3" placeholder="Enter amount of times to Bonk">

							<div class="text-center">
								<button :disabled="form.target.length < 3" class="btn btn-primary" type="submit">Bonk Me Daddy ({{payCost}} {{form.payMethod}})</button>
							</div>
						</form>
					</div>
				</div>
				<div class="card" v-else>
					<div class="card-body">
						<h4 class="mb-3">You Bonked {{ form.target }}!</h4>

						<a target="_blank" :href="`https://solscan.io/tx/${result.sig}`" class="mb-3 d-block small"><code class="small">{{result.sig}}</code></a>

						<a target="_blank" :href="shareURI()" class="btn btn-primary">Share on X</a>
						<button @click="reset" class="btn btn-primary ms-4">Bonk Again</button>
					</div>
				</div>
			</div>
		</div>

		<footer class="mt-3">
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
			baseURI: "https://bonk-api.fluxbeam.xyz",
			form: {
				target: "",
				hits: 1,
				payMethod: 'BONK',
				message: "",
			},
			loading: false,
			result: null,
			bonkCost: 1_000,
			solCost: 0.02,
			targetpfp: ""
		};
	},
	computed: {
		pfpUri: function() {
			if (this.targetpfp)
				return this.targetpfp
			return `https://unavatar.io/${this.form.target}`
		},
		payCost: function() {
			if(this.form.payMethod === "SOL")
				return this.solCost * this.form.hits
			else
				return this.bonkCost * this.form.hits
		}
	},
	methods: {
		reset: function () {
			this.loading = false
			this.result = null
			this.form.target = ""
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

			this.getPFP().then(r => {
				this.targetpfp = r
			})

			this.$toastr.s(`Finding ${this.form.target}...`)

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
					lamports: amount * Math.pow(10, 9) * this.form.hits,
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
					amount * this.form.hits,
					5,
					[],
					TOKEN_PROGRAM_ID
				))
			}

			await this.signAndSendTransaction(txn, "bonk_me", [],(sig) => {
				this.completeBonk(sig).finally(() => {
					this.loading = false
				})
			}).catch(e => {
				console.error("Failed to sign", e)
				this.$toastr.e(e, "Failed to sign")
				this.loading = false
			})
		},

		completeBonk: async function(sig) {
			this.$toastr.s(`Bonking ${this.form.target}...`)

			const sigResp = await this.$store.state.solana.client.confirmTransaction(
				sig,
				"confirmed"
			);

			if (sigResp?.value?.err) {
				this.$toastr.e(sigResp?.value?.err, "Transaction Error")
				return
			}

			this.$toastr.s(`Signature Confirmed...`)

			const resp = await this.postEndpoint(sig).catch(e => {
				console.error("failed to post endpoint", e)
				this.$toastr.e(`Failed to bonk`, e)
			})

			if (!resp)
				return


			this.$toastr.s(`Successfully Bonked ${this.form.target}...`)
			this.result = Object.assign({
				sig: sig
			}, resp)
		},

		getPFP: async function() {
			const resp = await fetch(`${this.baseURI}/v1/target/${this.form.target}`)
			if (resp.status !== 200)
				throw resp.statusText

			const jResp = await resp.json()
			return jResp.image
		},

		postEndpoint: async function(sig) {
			const resp = await fetch(`${this.baseURI}/v1/bonk`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					signature: sig,
					payer: this.$store.state.wallet.address,
					target: this.form.target,
					hits: this.form.hits,
					message: this.form.message,
				})
			})

			if (resp.status !== 200)
				throw resp.statusText

			return await resp.json()
		},

		shareURI: function () {
			const uri = "https://bonk-me.netlify.app%0A%0A"
			const text = `I just bonked @${this.form.target} on BonkMe!%0A%0A
			You can bonk others too!`
			const img = `${this.baseURI}/bonks/${this.result.id}.gif`

			return `https://twitter.com/share?text=${text}%0A%0A${img}%0A%0A&url=${uri}&hashtags=bonkMe,bonk`
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
