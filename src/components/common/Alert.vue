<template>
	<div class="card border-warn">
		<article class="flex gap-3 !py-2 card-content">
			<i class="bi-exclamation-triangle-fill text-amber-500"></i>
			<div class="whitespace-break-spaces">
				<slot></slot>
			</div>
		</article>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.border-warn {
	border-color: rgb(var(--amber500)) !important;
}
</style>
