import {web3} from "@project-serum/anchor";

export default {
	namespaced: true,
	state: () => ({
		endpoint: "",
		cluster: "mainnet-beta",
		commitment: "processed",
		client: null,
		tokenClient: null,
		swapClient: null,
		jitoClient: null,
		priorityFees: {"open": 1, "close": 1, "high": 1, "low": 1, "average": 1, "pct75": 1, "pct25": 1}
	}),
	mutations: {
		set_endpoint(state, url) {
			console.log("Using endpoint: ", url)
			state.endpoint = url
			state.client = new web3.Connection(state.endpoint, "processed")
			state.cluster = url.indexOf("devnet") > -1 ? "devnet" : "mainnet-beta"
		},
		set_commitment(state, commitment) {
			state.commitment = commitment
			state.client = new web3.Connection(state.endpoint, state.commitment)
		},
		set_cluster_fees(state, fees) {
			state.priorityFees = fees
		}
	},
}
