<template>
	<section class="w-full">
		<!-- cards -->
		<article class="md:hidden flex flex-col gap-2">
			<div v-for="(item, i) in data" :key="i">
				<slot name="card" :item="item"></slot>
			</div>
		</article>

		<!-- table -->
		<div class="max-md:hidden overflow-x-auto w-full">
			<table class="table border-b border-solid border-secondary mb-0">
				<thead class="bg-secondary">
					<slot name="thead"></slot>
				</thead>
				<tbody>
					<tr v-for="(item, i) in data" :key="i">
						<slot name="row" :item="item"></slot>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- footer -->
		<slot name="footer"></slot>
	</section>
</template>

<script>
export default {
	name: "TableResponsive",
	props: {
		data: Array,
	},
};
</script>

<style scoped>
.border-secondary {
	border-color: rgb(var(--borderSecondary)) !important;
}
.bg-secondary {
	background-color: rgb(var(--backgroundSecondary)) !important;
}
</style>
