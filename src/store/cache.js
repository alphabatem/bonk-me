import {web3} from "@project-serum/anchor";

export default {
	namespaced: true,
	state: () => ({
		tokenList: [],
		tokenMap: {
			"So11111111111111111111111111111111111111112": {decimals: 9, name: "Solana", symbol: "SOL", programID: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
			"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {decimals: 6, name: "USD Coin", symbol: "USDC", programID: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
		},
		collectionMap: localStorage.getItem("fluxbeam:collection_map") ? JSON.parse(localStorage.getItem("fluxbeam:collection_map")) : {},
		userNFTs: JSON.parse(localStorage.getItem('owned_nfts')) || [],
		userTokens: {},
		tokenPrices: {
			"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", price: 1, updatedAt: Date.now()}
		},
		usdPrice: 0,
		collections: [],
		nftPrices: {},
		loading: false
	}),
	mutations: {
		set_usd_price(state, price) {
			state.usdPrice = price;
		},
		set_nft_prices(state, prices = {}) {
			state.nftPrices = prices
		},
		set_collections(state, collections = []) {
			state.collections = collections
			state.collections.forEach(c => {
				state.collectionMap[c.address] = c
			})
		},
		add_collections(state, collections = []) {
			state.collections.push(...collections)
			collections.forEach(c => {
				state.collectionMap[c.address] = c
			})
		},
		set_metadata(state, r) {
			// console.log("Setting metadata", r)
			let m = Object.assign({}, state.tokenMap[r.address] || {})
			m.name = r.metadata.name
			m.symbol = r.metadata.symbol
			m.image = r.metadata.image


			state.tokenMap[r.address] = m
		},
		set_token_list(state, tokens) {
			state.tokenList = tokens

			state.tokenList?.forEach((t) => {
				state.tokenMap[t.address] = t
			})
		},
		set_user_nfts(state, owned) {
			state.userNFTs = owned;
			localStorage.setItem(`owned_nfts`, JSON.stringify(state.userNFTs))
		},
		set_user_tokens(state, tokens) {
			const vtm = {} //Valid tokens with balance
			tokens.forEach(t => {
				state.userTokens[t.account.data.parsed.info.mint] = t
				if (t.account.data.parsed.info.tokenAmount.uiAmount > 0)
					vtm[t.account.data.parsed.info.mint] = 1
			})

			state.tokenList = state.tokenList?.sort((a, b) => {
				return vtm[b.address] || 0 - vtm[a.address] || 0
			}) || []
		},
		set_token_price(state, tokenPrice = {mint: "", price: 0.0}) {
			tokenPrice.updatedAt = Date.now()
			state.tokenPrices[tokenPrice.mint] = tokenPrice
		},
		add_user_token(state, userToken) {
			// console.log("add_user_token", userToken.account.data.parsed.info.mint, userToken.account.data.parsed.info.tokenAmount.uiAmount)
			state.userTokens[userToken.account.data.parsed.info.mint] = userToken
		},
		add_token(state, token) {
			if (token.mint)
				token.address = token.mint

			// console.log("Cache::Adding token", token)
			if (state.tokenList?.filter((l) => l.address.toString() === token.address.toString()).length > 0) {
				// console.error("Token already added", token)
				return
			}

			state.tokenList.push(token)
			state.tokenMap[token.address.toString()] = token
		},
		set_loading_state(state, isLoading) {
			state.loading = isLoading
		}
	},
	actions: {
		async refreshUserBalance({commit, rootState, state}) {
			if (!rootState.wallet.connected)
				return

			//Get SOL Balance
			const r = await rootState.solana.client.getBalance(new web3.PublicKey(rootState.wallet.address)).catch(e => {
				console.error("Failed to get user sol balance", e)
			})


			const existingSOL = state.userTokens["So11111111111111111111111111111111111111112"]
			// console.log("WSOL Existing: ", existingSOL?.account.data.parsed.info.tokenAmount, state.userTokens["So11111111111111111111111111111111111111112"])

			let amount = r
			if (existingSOL) {
				// console.log("Refreshing user balance existingSOL", "existingSOL")
				amount += existingSOL?.account.data.parsed.info.tokenAmount?.uiAmount || 0
			}

			commit("add_user_token", {
				address: new web3.PublicKey("So11111111111111111111111111111111111111112"),
				pubkey: new web3.PublicKey("So11111111111111111111111111111111111111112"),
				account: {
					data: {
						parsed: {
							info: {
								mint: "So11111111111111111111111111111111111111112",
								owner: rootState.wallet.address,
								tokenAmount: {
									amount: `${amount}`,
									decimals: 9,
									uiAmount: amount / Math.pow(10, 9),
									uiAmountString: `${amount / Math.pow(10, 9)}`
								}
							}
						}
					}
				}
			})
		},
	},
}
