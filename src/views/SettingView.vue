<template>
	<section id="settings" class="container">
		<div class="row mt-5">
			<div class="col"><h1>Settings</h1></div>
			<div class="col-auto">
				<button @click="() => $router.back()" class="btn btn-white mb-2">
					Back
				</button>
			</div>
		</div>

		<form @submit="updateSettings">
			<div class="card animate__animated animate__fadeIn py-3 mb-3">
				<div class="card-header">
					<h6>Preferred Explorer</h6>
					<i class="small"
					>Select the explorer to use when viewing on-chain data.</i
					>
				</div>
				<div class="card-body field-group">
					<select
						v-model="form.explorer"
						class="input"
						@change="updateSettings"
					>
						<option value="https://explorer.solana.com">Solana Explorer</option>
						<option value="https://xray.helius.xyz">X Ray</option>
						<option value="https://solscan.io">Solscan</option>
						<option value="https://solana.fm">Solana.FM</option>
					</select>
				</div>
			</div>

			<div
				class="card animate__animated animate__fadeIn py-3 mb-3 animate__delay-300ms"
			>
				<div class="card-header">
					<h6>Custom RPC Endpoint</h6>
					<i class="small"
					>Use a custom RPC endpoint instead of the default on the FluxBeam
						UI.</i
					>
				</div>
				<div class="card-body field-group">
					<input
						v-model="form.customRpcUrl"
						class="input"
						placeholder="Default"
						@change="updateSettings"
					/>
				</div>
			</div>

			<div
				class="card animate__animated animate__fadeIn py-3 mb-3 animate__delay-600ms"
			>
				<div class="card-header">
					<h6>Slippage %</h6>
					<i class="small"
					>The maximum difference between the expected price of an order and
						the price when the order actually executes.</i
					>
				</div>
				<div class="card-body field-group">
					<input
						v-model.number="form.slippage"
						type="number"
						inputmode="decimal"
						min="0"
						max="100"
						step="0.1"
						placeholder="5.0"
						class="input"
						@change="updateSettings"
					/>
				</div>
			</div>

			<div class="card animate__animated animate__fadeIn py-3 mb-3 animate__delay-900ms">
				<div class="card-header">
					<h6>Bandwidth Markets
						<sup class="badge badge-solid-primary ml-2">Beta</sup>
					</h6>
					<i class="small"
					>Use priority delivery lanes (SWQoS) to accelerate transaction delivery.</i>
				</div>
				<div class="card-body">
					<label
					><input
						@change="updateSettings"
						v-model="form.bandwidthMarkets"
						type="checkbox"
						class="switch align-middle mr-2"
					/>{{form.bandwidthMarkets ? 'Enabled' : 'Disabled'}}</label
					>
				</div>
			</div>

			<div
				class="card animate__animated animate__fadeIn py-3 mb-3 animate__delay-900ms"
			>
				<div class="card-header">
					<h6>Priority Fee</h6>
					<i class="small"
					>Pay an additional gas fee to prioritise the transaction on the
						solana queue.</i
					>
				</div>
				<div class="card-body">
					<div class="row">
						<div class="col-12 col-md-4 mt-3">
							<button
								@click="(e) => onPrioritySet(e, 'market')"
								class="btn priority-btn w-100 mb-3"
								:class="{
                  'btn-solid-primary': form.priorityLevel === 'market',
                  'btn-white': form.priorityLevel !== 'market',
                }"
							>
								⚖️ Market
							</button>

							<button
								@click="(e) => onPrioritySet(e, 'high')"
								class="btn priority-btn w-100 mb-3"
								:class="{
                  'btn-solid-primary': form.priorityLevel === 'high',
                  'btn-white': form.priorityLevel !== 'high',
                }"
							>
								🔥 High
							</button>

							<button
								@click="(e) => onPrioritySet(e, 'turbo')"
								class="btn priority-btn w-100 mb-3"
								:class="{
                  'btn-solid-primary': form.priorityLevel === 'turbo',
                  'btn-white': form.priorityLevel !== 'turbo',
                }"
							>
								🚀 Turbo
							</button>
						</div>

						<div class="col">
							<table class="table text-end">
								<thead>
								<tr>
									<td class="text-start">Level</td>
									<td class="d-none d-lg-table-cell">Low</td>
									<td class="d-none d-lg-table-cell">High</td>
									<td>Average</td>
									<td>Max</td>
								</tr>
								</thead>
								<tbody>
								<tr
									:class="{
                      'active-fee-row': form.priorityLevel === 'market',
                    }"
								>
									<td class="text-start">⚖️ Market</td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{
												priorityLevelAmount("market", fees.pct25)
											}}
											SOL</code
										>
									</td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{
												priorityLevelAmount("market", fees.pct75)
											}}
											SOL</code
										>
									</td>
									<td>
										<code
										>{{
												priorityLevelAmount("market", fees.average)
											}}
											SOL</code
										>
									</td>
									<td>
										<code
											:class="{
                          strikethrough:
                            form.priorityFeeMax &&
                            form.priorityFeeMax !== 0.0075,
                        }"
										>0.0075 SOL</code
										>
										<code
											class="ms-1"
											v-if="
                          form.priorityFeeMax && form.priorityFeeMax !== 0.0075
                        "
										>{{ form.priorityFeeMax }} SOL</code
										>
									</td>
								</tr>
								<tr
									:class="{ 'active-fee-row': form.priorityLevel === 'high' }"
								>
									<td class="text-start">🔥 High <sup>5x</sup></td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{ priorityLevelAmount("high", fees.pct25) }} SOL</code
										>
									</td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{ priorityLevelAmount("high", fees.pct75) }} SOL</code
										>
									</td>
									<td>
										<code
										>{{
												priorityLevelAmount("high", fees.average)
											}}
											SOL</code
										>
									</td>
									<td>
										<code
											:class="{
                          strikethrough:
                            form.priorityFeeMax &&
                            form.priorityFeeMax !== 0.075,
                        }"
										>0.075 SOL</code
										>
										<code
											class="ms-1"
											v-if="
                          form.priorityFeeMax && form.priorityFeeMax !== 0.075
                        "
										>{{ form.priorityFeeMax }} SOL</code
										>
									</td>
								</tr>
								<tr
									:class="{
                      'active-fee-row':
                        form.priorityFeeMax && form.priorityLevel === 'turbo',
                    }"
								>
									<td class="text-start">🚀 Turbo <sup>10x</sup></td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{
												priorityLevelAmount("turbo", fees.pct25)
											}}
											SOL</code
										>
									</td>
									<td class="d-none d-lg-table-cell">
										<code
										>{{
												priorityLevelAmount("turbo", fees.pct75)
											}}
											SOL</code
										>
									</td>
									<td>
										<code
										>{{
												priorityLevelAmount("turbo", fees.average)
											}}
											SOL</code
										>
									</td>
									<td>
										<code
											:class="{
                          strikethrough:
                            form.priorityFeeMax && form.priorityFeeMax !== 0.1,
                        }"
										>0.1 SOL</code
										>
										<code
											class="ms-1"
											v-if="
                          form.priorityFeeMax && form.priorityFeeMax !== 0.1
                        "
										>{{ form.priorityFeeMax }} SOL</code
										>
									</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="card-header">
					<h6>Max Priority Fee <sup>(SOL)</sup></h6>
					<i class="small"
					>Maximum amount to spend per transaction on priority fees (lowest
						fee is always used)</i
					>
				</div>
				<div class="card-body field-group">
					<div class="input-group input">
						<input
							@change="updateSettings"
							v-model.number="form.priorityFeeMax"
							class="input d-inline-block"
							placeholder="Max Priority Fee (SOL)"
							type="number"
							min="0"
							max="2"
							step="1"
						/>
						<button class="btn btn-link-warn" @click="clearMaxFee">
							Clear
						</button>
					</div>
				</div>
			</div>

			<div class="card animate__animated animate__fadeIn py-3 mb-3">
				<div class="card-header">
					<h6>Validator Tip <sup>(SOL)</sup></h6>
					<i class="small"
					>Pay an additional tip to the validator to speed up transaction
						delivery. (When using high tips, priority fees are not needed)</i
					>
				</div>
				<div class="card-body field-group">
					<div class="input-group input">
						<input
							@change="updateSettings"
							v-model.number="form.validatorTip"
							class="input"
							placeholder="Delivery Tip (SOL)"
							type="number"
							min="0"
							max="2"
							step="1"
						/>
						<button class="btn btn-link-warn" @click="clearValidatorTip">
							Clear
						</button>
					</div>
				</div>
			</div>

			<!--				<div class="form-group mt-4">-->
			<!--					<label>Degeneracy</label>-->
			<!--					<select v-model="form.degenModeLevel" class="form-control">-->
			<!--						<option value="whale">🐋 Whale</option>-->
			<!--						<option value="shrimp">🦐 Shrimp</option>-->
			<!--					</select>-->
			<!--				</div>-->

			<div class="card animate__animated animate__fadeIn">
				<div class="card-footer text-end">
					<button @click="clearCache" class="btn btn-white">
						<i class="fa fa-refresh"></i> Reset
					</button>
					<button @click="updateSettings" class="btn btn-solid-primary ms-4">
						<i class="fa fa-save"></i> Update
					</button>
				</div>
			</div>
		</form>
	</section>
</template>

<script>
export default {
	name: "SettingView",
	data() {
		return {
			form: {
				explorer: "https://solana.fm",
				customRpcUrl: "",
				degenModeLevel: "shrimp",
				slippage: 5,
				bandwidthMarkets: true,
				validatorTip: null,
				priorityFeeMax: null,
				priorityLevel: this.$store.state.settings.priorityLevel || "market",
			},
		};
	},
	computed: {
		fees: function () {
			return this.$store.state.solana.priorityFees;
		},
	},
	methods: {
		clearMaxFee: function (e) {
			e.preventDefault();
			this.form.priorityFeeMax = null;
		},

		clearValidatorTip: function (e) {
			e.preventDefault();
			this.form.validatorTip = null;
		},

		priorityLevelAmount: function (level, val) {
			let hVal = val / Math.pow(10, 9);
			let max;
			switch (level) {
				case "market":
					max = 0.0075;
					break;
				case "high":
					max = 0.075;
					hVal = hVal * 5;
					break;
				case "turbo":
					max = 0.1;
					hVal = hVal * 10;
					break;
			}

			return Math.min(hVal, max).toFixed(5);
		},

		updateSettings: function (e) {
			e.preventDefault();

			this.$store.commit("settings/update", this.form);

			const rpcUri =
				this.$store.state.settings.customRpcUrl || this.$store.state.rpc.rpcUrl;
			this.$store.commit("solana/set_endpoint", rpcUri);
			this.$toastr.s("Settings updated");
		},
		clearCache: function () {
			localStorage.clear();
			window.location.reload();
		},

		onPrioritySet: function (e, priority) {
			e.preventDefault();
			this.form.priorityLevel = priority;
			this.$store.commit("settings/setPriorityLevel", priority);
			this.updateSettings(e);
		},
	},
	beforeMount() {
		this.form = Object.assign(
			{
				explorer: "https://solana.fm",
				customRpcUrl: "",
			},
			this.$store.state.settings
		);
	},
};
</script>

<style scoped>
.priority-btn {
	font-weight: normal;
	line-height: 1.5;
}

.form-control {
	height: 40px;
}

code {
	font-size: 1rem;
}

.strikethrough {
	text-decoration: line-through;
	color: red;
}

.active-fee-row {
	background: rgba(255, 255, 255, 0.2);
}

i.small {
	font-size: 0.7rem;
}

h6 {
	margin-bottom: 0;
}
</style>
