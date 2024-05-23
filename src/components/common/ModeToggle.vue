<template>
	<span class="d-flex align-items-center fw-bold">
		<span :class="{active: !toggled}">{{ a }}</span>
	<label class="switch mx-2 mt-0">
		<input v-model="toggled" type="checkbox">
		<span class="slider"></span>
	</label>
		<span :class="{active: toggled}">{{ b }}</span>
	</span>
</template>

<script>
export default {
	name: "ModeToggle",
	props: {
		a: {
			type: String
		},
		b: {
			type: String
		},
		isToggled: {
			type: Boolean
		}
	},
	data() {
		return {
			toggled: this.isToggled
		}
	},
	watch: {
		toggled: function() {
			this.$emit('toggle', this.toggled)
		}
	}
}
</script>

<style scoped>
span.active {
	color: var(--bs-primary);
	transition: color 0.3s linear;
}

span {
	display: none;
	pointer-events: none;
}
</style>