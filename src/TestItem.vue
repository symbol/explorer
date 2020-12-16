<template>
	<div class="root">
		<div class="name">
			<strong>{ name }</strong>
		</div>
		<div class="value">
			<div class="progress">
				<div class="progress-value" />
				<div class="value-text">{ value }</div>
			</div>
			<div class="enough-value-text">{ enoughValue }</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TestItem',

	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: [String | Number],
			required: true
		},
		enoughValue: {
			type: [String | Number],
			required: true
		},
		passed: {
			type: Boolean,
			required: true
		},
		translate: {
			type: Function,
			default: e => e
		}
	},

	data() {
		return {
		}
	},

	computed: {
	},

}
</script>

<style lang="scss" scoped>

</style>