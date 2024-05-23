import {useWallet} from "@alphabatem/vue2-wallet-adapter";

export default {
	methods: {
		signAndSendTransaction: async function (txn, event, signers = [], onComplete = () => {
		}) {
			if (this.$store.state.settings.validatorTip > 0)
				return this.signAndSendBundle(txn, event, signers, onComplete)

			const wallet = useWallet()
			console.log("signAndSendTransaction:Transaction", txn)

			if (txn.signatures.length === 0) {
				txn.feePayer = wallet.publicKey
				if (!txn.recentBlockhash) {
					const hash = await this.$store.state.solana.client.getLatestBlockhash("confirmed")
					txn.recentBlockhash = hash.blockhash
				}
			}

			txn = await wallet.signTransaction(txn)

			if (signers.length > 0)
				await txn.partialSign(...signers)

			console.log("SignedTXN", txn)

			const sig = await this._sendSignedTransaction(event, wallet, txn, signers)


			this.$store.commit("signatures/add_signature", {sig: sig, status: {}})

			onComplete(sig)
			return sig
		},

		signAndSendAllTransactions: async function (txns = [], event, signers = [[]], recentBlockhash, payer, onComplete = () => {
		}, statusCheck = true) {
			console.log("signAndSendAllTransactions:Transaction", txns)
			const wallet = this.$store.state.wallet.wallet

			//Partial sign if needed
			for (let i = 0; i < txns.length; i++) {
				txns[i].recentBlockhash = recentBlockhash
				txns[i].feePayer = payer
				if (signers[i])
					txns[i].partialSign(...signers[i])
			}

			const sigs = [];
			const signed = await wallet.signAllTransactions(txns)
			for (let i = 0; i < signed.length; i++) {
				const sig = await this._sendSignedTransaction(event, wallet, signed[i])

				if (statusCheck)
					this.$store.commit("signatures/add_signature", {sig: sig, status: {}})

				console.log("SIG", sig)
				sigs.push(sig)
			}

			onComplete(sigs)
			return sigs
		},

		_sendSignedTransaction: async function (event, wallet, txn, signers = []) {
			const sig = await this.$store.state.solana.client.sendRawTransaction(txn.serialize(), {signers: signers, skipPreflight: true}).catch(e => {
				console.error(`sendRawTransaction Transaction Failed ${event}`, e)
				this.$toastr.e(e.message || e, `Transaction Failed`) //TODO parseCustomError is no good for other programs
				window.gtag("event", `${event}_fail`, {error: e})
			})

			if (!sig) {
				return
			}

			this._relayTransaction(wallet.publicKey, Buffer.from(txn.serialize()).toString("base64"), this.$store.state.settings.bandwidthMarkets)

			let i = 0;
			const fireTxn = setInterval(() => {
				console.log(sig, "TXN SEND")
				this.$store.state.solana.client.sendRawTransaction(txn.serialize(), {signers: signers, skipPreflight: true}).catch(() => {
				}).finally(() => {
					if (i > 2) {
						clearInterval(fireTxn)
					}
					i++
				})
			}, 1600)

			console.log("SIG", sig)

			this.$toastr.s({
				title: "Transaction Sent",
				msg: sig,
				onClicked: () => {
					window.open(`${this.$store.state.settings.explorer}/tx/${sig}?${this.$store.getters["settings/clusterQuery"]}`, "_blank")
				}
			})
			window.gtag("event", `${event}_success`, {sig: sig})
			return sig
		},

		_relayTransaction: async function (walletAddr, txn, useBandwidthMarkets = true) {
			fetch(`https://api.fluxbeam.xyz/v1/solana/sendTransaction?bwmkt=${useBandwidthMarkets}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wallet: walletAddr,
					transaction: txn
				})
			}).catch(() => {
			})
		},

		_relayBundle: async function (walletAddr, txns) {
			fetch(`https://api.fluxbeam.xyz/v1/solana/sendBundle`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wallet: walletAddr,
					transactions: txns
				})
			}).catch(() => {
			})
		}
	}
}