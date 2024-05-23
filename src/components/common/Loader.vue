<template>
	<div @click="forceExit" class="loader-container animate__animated animate__fadeIn">
		<div class="container">
			<div class="row">
				<div class="col-auto mx-auto">
					<div class="card animate__animated animate__fadeIn">
						<div class="card-body p-5 m-5 pb-0 pt-3">
							<i class="fa fa-circle-notch fa-spin fa-2x"></i>
						</div>
						<div class="card-footer text-center">
							<h1>LOADING</h1>
						</div>
					</div>

					<div class="text-center mt-3 animate__animated animate__fadeIn" v-if="showExit">
						<h6 class="mb-0">Loading stuck?</h6>
						<p class="small">Click here to exit.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Loader",
	data() {
		return {
			timeout: null,
			showExit: false
		}
	},
	methods: {
		forceExit: function() {
			if (!this.showExit)
				return

			this.$store.commit("cache/set_loading_state", false)
		}
	},
	mounted() {
		this.timeout = setTimeout(() => {
			this.showExit = true
		}, 7 * 1000)
	},
	beforeDestroy() {
		clearTimeout(this.timeout)
	}
}
</script>

<style scoped>
.loader-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
}

.card {
	margin-top: 33vh;
}

.card-footer h1 {
	animation: bounce 3s infinite;
}

@keyframes bounce {
	0% {
		transform: scale(1.1);
	}
	50% {
		transform: scale(0.8);
	}
	100% {
		transform: scale(1.1);
	}
}
</style>