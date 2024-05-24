<template>
	<tr>
		<td><AccountAddress :address="row.payer"></AccountAddress></td>
		<td class="text-end">{{ row.hitCount }}</td>
	</tr>
</template>

<script>
import AccountAddress from "@/components/common/AccountAddress.vue";

export default {
	name: "PayerRow",
	components: {AccountAddress},
	data() {
		return {
			image: ""
		}
	},
	props: {
		row: {
			type: Object,
			required: true
		}
	},
	methods: {
		fetchImage: async function () {
			const resp = await fetch(`https://bonk-api.fluxbeam.xyz/v1/target/${this.row.target}`)
			if (resp.status !== 200)
				throw resp.statusText

			const jResp = await resp.json()
			return jResp.image
		},
	},
	beforeMount() {
		this.fetchImage().then(r => {
			this.image = r
		})
	}
}
</script>

<style scoped>
.pfp {
	width: 75px;
	border-radius: 7px;
	border: 2px solid white;
}

td {
	vertical-align: middle;
}
tr {
	transition: background-color 0.3s linear;
	border-radius: 14px;
	cursor: pointer;
}

tr:hover {
	background-color: rgba(255,255,255,0.3);
}
</style>