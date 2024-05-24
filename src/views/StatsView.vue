<template>
	<div class="stats mt-5">
		<div class="row">
			<div class="col-12 col-md-10 col-lg-8 m-lg-auto">
				<div class="card">
					<div class="card-header row">
						<div class="col"><h4>Leaderboard</h4></div>
						<div class="col-auto">
							<div class="pay-method float-end text-start">
								<button @click="toggleView" :class="{'active': topPayers}" class="btn btn-toggle btn-sm small p-1 py-0">PAYERS</button>
								<button @click="toggleView" :class="{'active': !topPayers}" class="btn btn-toggle btn-sm small p-1 py-0">TARGETS</button>
							</div>
						</div>

					</div>
					<div class="card-body">
						<table v-if="topPayers" class="table table-borderless">
							<thead>
							<tr>
								<th>Payer</th>
								<th class="text-end">Bonks</th>
							</tr>
							</thead>
							<tbody>
							<PayerRow v-for="(row, id) in rows" :key="id" :row="row"></PayerRow>
							</tbody>
						</table>
						<table v-else class="table table-borderless">
							<thead>
							<tr>
								<th>Target</th>
								<th class="text-end">Times Bonked</th>
							</tr>
							</thead>
							<tbody>
							<TargetRow v-for="(row, id) in rows" :key="id" :row="row"></TargetRow>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TargetRow from "@/components/stats/TargetRow.vue";
import PayerRow from "@/components/stats/PayerRow.vue";

export default {
	name: "StatsView",
	components: {TargetRow, PayerRow},
	data() {
		return {
			rows: [],
			topPayers: false,
		}
	},
	methods: {
		toggleView: function() {
			this.rows = []
			this.topPayers=!this.topPayers
			this.getStats().then(r => {
				this.rows = r
			}).catch(e => {
				this.$toastr.e(e)
			})
		},
		getTopTargets: async function () {
			const resp = await fetch("https://bonk-api.fluxbeam.xyz/v1/stats/targets")
			if (resp.status !== 200) {
				throw resp.statusText
			}
			return await resp.json()
		},
		getTopPayers: async function () {
			const resp = await fetch("https://bonk-api.fluxbeam.xyz/v1/stats/payers")
			if (resp.status !== 200) {
				throw resp.statusText
			}
			return await resp.json()
		},
		getStats: function() {
			if (this.topPayers)
				return this.getTopPayers()

			return this.getTopTargets()
		}
	},
	mounted() {
		this.getStats().then(r => {
			this.rows = r
		}).catch(e => {
			this.$toastr.e(e)
		})
	}
}
</script>

<style scoped>
</style>