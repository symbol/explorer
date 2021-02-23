<template>
	<div class="table-root">
		<div class="table-wrapper">
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
					<div v-if="caption" class="caption">
						{{ caption }}
					</div>
				</tbody>
			</table>
		</div>
		<Modal
			v-if="isModalShown"
			:title="selectedItem"
			:data="selectedItemData"
			:passed="selectedItemPassed"
			@close="closeModal"
		/>
	</div>
</template>

<script>
import translate from '../i18n';
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
			type: String
		}
	},

	mounted() {
		this.selectedItem = '';
		this.isModalShown = false;
	},

	data() {
		return {
			isModalShown: false,
			selectedItem: ''
		};
	},

	computed: {
		selectedItemData() {
			return this.selectedItem && this.data && this.data[this.selectedItem] && this.data[this.selectedItem].details
				? this.data[this.selectedItem].details
				: {};
		},

		selectedItemPassed() {
			return this.selectedItem && this.data && this.data[this.selectedItem]
				? this.data[this.selectedItem].passed
				: null;
		},

		caption() {
			if (!this.data || this.data.length < 1)
				return translate(this.language, 'nothingToShow');

			return null;
		}
	},

	methods: {
		onItemClick(itemName) {
			console.log(itemName);
			this.selectedItem = itemName;
			this.isModalShown = true;
		},
		closeModal() {
			this.isModalShown = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.table-root {
    background: transparent;
}

.table-wrapper {
    padding-top: 20px;
    position: relative;
}

.table-component {
    table-layout: fixed;
    width: 100%;
}

.caption {
    text-align: center;
    width: 100%;
    font-size: 10px;
    opacity: 0.5;
}
</style>
