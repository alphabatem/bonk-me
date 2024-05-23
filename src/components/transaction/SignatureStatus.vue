<template>
	<tbody>
	<tr class="signature-status text-start" @click="linkTo">
		<td>
			<SignatureAddress :address="signature"></SignatureAddress>
		</td>
		<td v-if="sigStatus?.err"><i class="fa fa-circle-exclamation red"></i></td>
		<td v-else-if="sigStatus.slot"><i class="fa fa-circle-check green"></i></td>
		<td v-else>-</td>
		<td class="progress-container">
			<div class="progress" :style="backgroundStyl">
				<div class="progress-bar" role="progressbar" :style="statusStyl" :aria-valuenow="progressValue"
						aria-valuemin="0" aria-valuemax="100"></div>
			</div>
			<code class="progress-code">{{ error ? error : humanStatus }}</code>
		</td>
	</tr>
	</tbody>
</template>

<script>
import SignatureAddress from "@/components/common/SignatureAddress.vue";

export default {
	name: "SignatureStatus",
	components: {SignatureAddress},
	props: {
		signature: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			sigStatus: {},
			humanStatus: "Sending...",
			interval: null,
			progressValue: 0,
			notiSent: false,
		}
	},
	computed: {
		error: function () {
			if (!this.sigStatus?.err) {
				return ""
			}

			if (!this.sigStatus?.err?.InstructionError)
				return this.sigStatus?.err

			const errCode = this.sigStatus?.err?.InstructionError[1]?.Custom
			return errCode || ""
		},

		backgroundStyl: function () {
			if (this.sigStatus?.confirmationStatus !== "confirmed")
				return {}

			return {
				backgroundColor: "rgb(25 135 84 / 25%)"
			}
		},

		statusStyl: function () {
			if (this.sigStatus?.err) {
				return {
					width: `100%`,
					maxWidth: `100%`,
					backgroundColor: "red"
				}
			}

			const styl = {
				width: `100%`,
				maxWidth: `100%`
			}
			switch (this.humanStatus) {
				case "Processed":
					styl.backgroundColor = "rgb(25 135 84 / 50%)"
					break
				case "Confirmed":
					styl.maxWidth = "100%"
					styl.backgroundColor = "rgb(25 135 84 / 80%)"
					break
				case "Finalized":
					styl.maxWidth = `${(this.sigStatus?.confirmations / 30) * 100}%`
					styl.backgroundColor = "rgb(25 135 84 / 100%)"
					break
				default:
					// styl.maxWidth = "0%"
					// styl.backgroundColor = "rgb(13 110 253 / 50%)"

					styl.maxWidth = `${this.progressValue}%`
					styl.backgroundColor = "rgb(255 255 255 / 15%)"
					break
			}
			return styl
		}
	},
	methods: {
		getProgressValue: function () {
			if (!this.sigStatus?.confirmations || this.sigStatus?.confirmations === 0) {
				return ((new Date() - this.sigStatus.createdAt) / 60_000) * 100
			}

			return ((this.sigStatus?.confirmations || 30) / 30) * 100
		},

		getHumanStatus: function () {
			if (this.sigStatus?.confirmationStatus === "timeout")
				return "Timeout"

			if (this.sigStatus?.err)
				return "Error"

			switch (this.sigStatus?.confirmationStatus) {
				case "processed":
					return "Processed"
				case "confirmed":
					return "Confirmed"
				case "finalized":
					return "Finalized"
				default:
					return "Sending..."
			}
		},

		linkTo: function () {
			window.open(this.link(), "_blank")
		},
		link: function () {
			return `${this.$store.state.settings.explorer}/tx/${this.signature}?${this.$store.getters["settings/clusterQuery"]}`
		},
	}, mounted() {

		this.progressInterval = setInterval(() => {
			if (this.done) {
				clearInterval(this.progressInterval)
				return
			}

			const s = this.$store.state.signatures.activeSignatures[this.signature]
			if (!s)
				return;

			this.sigStatus = s
			this.humanStatus = this.getHumanStatus()
			this.progressValue = this.getProgressValue()
			if (this.sigStatus.confirmations > 0 || this.sigStatus.err)
				this.done = true

		}, 300)
	},
	beforeDestroy() {
		if (this.progressInterval)
			clearInterval(this.progressInterval)
	}
}
</script>

<style scoped>
tr {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: nowrap;
	transition: background-color 0.3s linear;
}

tr:not(.error):hover {
	cursor: pointer;
	background: rgba(255, 255, 255, 0.2);
}

.progress {
	width: 100%;
	height: 3vh;
	border-radius: 0;
	border: 1px solid white;
	background: transparent;
	transition: background-color 0.3s linear;
}

.progress-bar {
	transition: all 0.3s linear;
}

.progress-container {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 60%;
}

.progress-container code {
	position: absolute;
	width: 100%;
	text-align: center;
	background: transparent;
}

</style>