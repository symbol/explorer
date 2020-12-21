<template>
	<div class="main-root">
		<History :data="history" />
	</div>
</template>

<script>
import History from './History.vue';

export default {
	name: 'Main',

	components: { History },

	props: {
		data: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		}
	}
}
</script>

<style lang="scss" scoped>
.main-root {
	background: transparent;
	position: relative;
}
</style>