<template>
	<div class="stats mt-5">
		<div class="row">
			<div class="col-12 col-md-10 col-lg-8 m-lg-auto">
				<div class="card">
					<div class="card-header">
						<h4>Latest</h4>
					</div>
					<div class="card-body">
						<table class="table table-borderless">
							<thead>
							<tr>
								<th>Target</th>
								<th>Bonks</th>
								<th>Payer</th>
								<th>Signature</th>
								<th>Bonked At</th>
							</tr>
							</thead>
							<tbody>
							<LatestRow v-for="(row, key) in rows" :key="key" :row="row"></LatestRow>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import LatestRow from "@/components/stats/LatestRow.vue";

export default {
	name: "LatestView",
	components: {LatestRow},
	data() {
		return {
			rows: [],
		}
	},
	methods: {
		getLatest: async function() {
			const resp = await fetch("https://bonk-api.fluxbeam.xyz/v1/stats/latest")
			if (resp.status !== 200) {
				throw resp.statusText
			}
			return await resp.json()
		}
	},
	mounted() {
		this.getLatest().then(r => {
			this.rows = r
		}).catch(e => {
			this.$toastr.e(e)
		})
	}
}
</script>

<style scoped>
</style>