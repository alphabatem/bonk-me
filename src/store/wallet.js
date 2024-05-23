export default {
	namespaced: true,
	state: () => ({
		connected: false,
		address: null,
		wallet: null,
	}),
	mutations: {
		set_wallet(state, wallet) {
			state.wallet = wallet;
			state.address = wallet?.publicKey?.toString()
		},
		set_wallet_connected(state, connected) {
			state.connected = connected;
		},

		set_wallet_address(state, addr) {
			state.address = addr?.toString();
		},

		clear_wallet(state) {
			state.connected = false
			state.address = null
			state.wallet = null
		}
	},
	actions: {
		walletConnected({commit, state}) {
			if (state.connected)
				return

			commit("set_wallet_connected", true)
		},
		walletDisconnected({commit, state}) {
			if (!state.connected)
				return

			commit("clear_wallet")
		}
	}
}
