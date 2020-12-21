<template>
	<div class="history-root">
	</div>
</template>

<script>

export default {
	name: 'History',

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
.history-root {

}
</style>