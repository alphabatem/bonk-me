<template>
	<tr>
		<td v-if="holder.address">
			<AccountAddress :address="holder.address"></AccountAddress>
		</td>
		<td>
			<AccountAddress :address="holder.owner"></AccountAddress>
		</td>
		<td class="text-end">{{ fmt.format(holder.amount || 0) }}</td>
		<td class="text-end">{{ fmt.format(airdropAmount()) }}</td>
	</tr>
</template>

<script>
import AccountAddress from "@/components/common/AccountAddress.vue";

export default {
	name: "FluxHolderRow",
	components: {AccountAddress},
	props: {
		holder: {
			type: Object,
			required: true
		},
		amount: {
			type: Number,
			default() {
				return 1;
			}
		},
		minTokens: {
			type: Number,
			default() {
				return 0;
			}
		},
		mode: {
			type: Number,
			default() {
				return 0;
			}
		},
		fmt: {
			//
		},
	},
	methods: {
		airdropAmount: function() {
			if (this.holder?.amount < this.minTokens)
				return 0

			return this.mode ? this.holder?.amount * this.amount : this.amount
		}
	}
}
</script>

<style scoped>

</style>