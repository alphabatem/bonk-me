function statusToIota (s) {
	switch (s) {
		default:
			return 0
		case "processed":
			return 1
		case "confirmed":
			return 2
		case "finalized":
			return 3
		case "timeout":
			return 4
	}
}

export default {
	namespaced: true,
	state: () => ({
		lastCheck: 0,
		activeSignatures: {},
		activeSignatureCount: 0,
		lastRefresh: 0
	}),
	mutations: {
		add_signature(state, {sig, status}) {
			console.log("signatures::add_signature", sig, status)
			state.activeSignatures[sig] = {
				status: status,
				createdAt: new Date()
			}
			state.activeSignatureCount = Object.keys(state.activeSignatures).length
		},

		update_status(state, {sig, status}) {
			if (!status)
				return;

			console.log("signatures::update_status", sig, status)
			if (statusToIota(state.activeSignatures[sig]?.status?.confirmationStatus) > statusToIota(status?.confirmationStatus))
				return

			state.activeSignatures[sig] = Object.assign(state.activeSignatures[sig], status)
			state.activeSignatureCount = Object.keys(state.activeSignatures).length
		},
		clear_status(state, sig) {
			console.log("signatures::clear_status", sig)
			delete state.activeSignatures[sig]
		},
		clear_all(state) {
			// console.log("signatures::clear_all")
			state.activeSignatures = {};
			state.lastCheck = 0;
			state.activeSignatureCount = 0
		}
	},
	actions: {
		//Race condition with the clear_all
		async refresh({state, commit, rootState}) {
			const now = Date.now();
			if (now - state.lastRefresh < 800) {
				return;
			}
			state.lastRefresh = now;

			const sigs = []
			const keys = Object.keys(state.activeSignatures)
			for(let i = 0; i < keys.length; i++) {
				const si = state.activeSignatures[keys[i]]
				if (si?.confirmations > 0 || si?.err)
					continue

				sigs.push(keys[i])
			}
			if (!sigs.length)
				return

			console.log("signatures::refresh fetching:", sigs, sigs.length)
			const status = await rootState.solana.client.getSignatureStatuses(sigs, {searchTransactionHistory: false}).catch()
			if (Object.keys(state.activeSignatures).length === 0)
				return //Cleared between the 2 checks

			status?.value?.forEach((s, i) => {

				if (state.activeSignatures[sigs[i]]?.confirmationStatus === "confirmed" || state.activeSignatures[sigs[i]]?.confirmationStatus === "timeout" || state.activeSignatures[sigs[i]]?.err) {
					commit("update_status", {sig: sigs[i], status: s})
					return //Skip only if we have already set to finalized or already errored
				}

				if (new Date() - state.activeSignatures[sigs[i]]?.createdAt > 60_000) {
					commit("update_status", {sig: sigs[i], status: {confirmationStatus: "timeout", err: "Timeout"}})
					return //Skip only if we have already set to finalized or already errored
				}

				commit("update_status", {sig: sigs[i], status: s})
			})
		}
	}
}
