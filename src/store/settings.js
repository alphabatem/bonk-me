export default {
	namespaced: true,
	state: () => (localStorage.getItem("bonkMe:v1:settings") ? JSON.parse(localStorage.getItem("bonkMe:v1:settings")) : {
		explorer: "https://solana.fm",
		customRpcUrl: "",
		slippage: 5,
		validatorTip: null,
		priorityFeeMax: null,
		priorityLevel: "market",
		degenModeLevel: "shrimp",
		bandwidthMarkets: true,
	}),
	mutations: {
		update(state, settings) {
			const ok = Object.keys(settings)
			for (let i = 0; i < ok.length; i++)
				state[ok[i]] = settings[ok[i]]

			localStorage.setItem("bonkMe:v1:settings", JSON.stringify(state))
		},
		setPriorityLevel(state, level) {
			state.priorityLevel = level
			localStorage.setItem("bonkMe:v1:settings", JSON.stringify(state))
		}
	},
	getters: {
		cluster: function (state) {
			let cluster = "mainnet-beta"
			if (state.customRpcUrl.indexOf("testnet") > -1)
				cluster = "testnet"
			if (state.customRpcUrl.indexOf("devnet") > -1)
				cluster = "devnet"

			return cluster
		},
		clusterQuery: function (state) {
			let cluster = "mainnet-beta"
			if (state.customRpcUrl.indexOf("testnet") > -1)
				cluster = "testnet"
			else if (state.customRpcUrl.indexOf("devnet") > -1)
				cluster = "devnet"
			else if (state.customRpcUrl !== "")
				return `cluster=custom&customUrl=${state.customRpcUrl}`

			return `cluster=${cluster}`
		},
		validatorTip: function (state) {
			return Math.floor(state.validatorTip * Math.pow(10, 9))
		},
		priorityFee: function (state, getters, rootState, rootGetters) {
			const fees = rootGetters['solana/fees']

			let fee
			let max = 2
			switch (state.priorityLevel) {
				default:
				case 'market':
					fee = fees.pct75
					max = 0.0075
					break
				case 'high':
					fee = fees.pct75 * 5
					max = 0.075
					break
				case 'turbo':
					fee = fees.pct75 * 10
					max = 0.1
					break
			}

			max = max * Math.pow(10, 9)

			let customMaxFee = max
			if (state.priorityFeeMax)
				customMaxFee = state.priorityFeeMax * Math.pow(10, 9)

			fee = Math.min(fee, max)
			if (customMaxFee !== 0) {
				fee = Math.min(fee, customMaxFee)
				return fee
			}

			if (fee === 0) {
				fee = 0.00002 * Math.pow(10, 9) //Sane default
			}

			return fee * 1_000_000
		}
	}
}
