<template>
	<div class="ttip">
		<slot><sup><i class="ms-1 info fa fa-info-circle xsmall"></i></sup></slot>
		<span class="tooltiptext small">{{ text }}</span>
	</div>
</template>

<script>
export default {
	name: "Tooltip",
	props: {
		text: {
			type: String,
			required: true
		}
	}
}
</script>

<style scoped>
.ttip {
	position: relative;
	display: inline-block;
}

/* Tooltip text */
.ttip .tooltiptext {
	visibility: hidden;
	width: 200px;
	bottom: 140%;
	left: 50%;
	margin-left: -100px; /* Use half of the width */
	background-color: rgba(0,0,0,0.9);
	color: #fff;
	text-align: center;
	padding: 5px 0;
	border-radius: 6px;
	border: 1px solid white;

	position: absolute;
	z-index: 1;

	opacity: 0;
	transition: all 0.3s linear;
}

.ttip:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
}
</style>