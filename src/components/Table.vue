<template>
	<div class="table-root">
		<table class="table-component">
			<TestItem 
				v-for="(item, index) in data" 
				:name="index"
				:passed="item.passed"
				:value="item.value"
				:expectedValue="item.expectedValue"
				:language="language" 
				:key="'' + index + 'test-item'"
			/>
		</table>
	</div>
</template>

<script>
import TestItem from './TestItem.vue';

export default {
	name: 'Table',

	components: { TestItem },

	props: {
		data: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		},
	},

	data() {
		return {
		}
	},

	computed: {
	},

}
</script>

<style lang="scss">
.table-root {
	background: transparent;
	position: relative;
}

.table-component {
	table-layout: fixed;
	width: 100%;
}
</style>