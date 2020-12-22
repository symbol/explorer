<template>
	<div class="table-root">
		<table class="table-component">
			<tbody>
				<TestItem 
					v-for="(item, index) in data" 
					:name="index"
					:passed="item.passed"
					:value="item.value"
					:expectedValue="item.expectedValue"
					:language="language" 
					:key="'' + index + 'test-item'"
					@click="onItemClick"
				/>
			</tbody>
		</table>
		<Modal 
			v-if="isModalShown" 
			:title="selectedItem"
			:data="selectedItemData"
			@close="closeModal"
		/>
	</div>
</template>

<script>
import TestItem from './TestItem.vue';
import Modal from './Modal.vue';

export default {
	name: 'Table',

	components: { TestItem, Modal },

	props: {
		data: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		},
	},

	mounted() {
		this.selectedItem = '';
		this.isModalShown = false;
	},

	data() {
		return {
			isModalShown: false,
			selectedItem: ''
		}
	},

	computed: {
		selectedItemData() {
			return this.selectedItem && this.data && this.data[this.selectedItem] && this.data[this.selectedItem].details
				? this.data[this.selectedItem].details
				: {};
		}
	},

	methods: {
		onItemClick(itemName) {
			console.log(itemName)
			this.selectedItem = itemName;
			this.isModalShown = true;
		},
		closeModal() {
			this.isModalShown = false;
		}
	}
}
</script>

<style lang="scss" scoped>
.table-root {
	background: transparent;
}

.table-component {
	position: relative;
	table-layout: fixed;
	width: 100%;
}
</style>