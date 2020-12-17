<template>
	<div class="table-root">
		<div class="vert-line" />
		<TestItem 
			v-for="(item, index) in data" 
			:name="index"
			:passed="item.passed"
			:value="item.value"
			:enoughValue="'228'"
			:key="'' + index + 'test-item'"
		/>
	</div>
</template>

<script>
import TestItem from './TestItem.vue';

export default {
	name: 'TestTable',

	components: { TestItem },

	props: {
		data: {
			type: Object,
			required: true
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

<style lang="scss">
.table-root {
	background: transparent;
	position: relative;
}

.vert-line {
	z-index: 0;
	top: -20%;
	right: 50px;
	position: absolute;
    width: 1px;
	height: 130%;
    background-image: linear-gradient(to bottom, rgba(255, 0, 255, 0), $pink-color, rgba(0, 0, 0, 0));
}
</style>