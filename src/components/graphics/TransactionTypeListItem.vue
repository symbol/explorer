<template>
	<b-list-group-item
		class="d-flex justify-content-between align-items-center list-item"
		:title="title"
	>
		<TransactionType :value="transactionType" />
		<b-badge v-if="isValueExist" variant="primary" pill>{{ _value }}</b-badge>
		<div v-else> &nbsp; </div>
	</b-list-group-item>
</template>

<script>
import TransactionType from '@/components/fields/TransactionType.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		TransactionType
	},

	props: {
		transactionType: {
			type: Number
		},

		value: {
			type: [Number, String]
		}
	},

	computed: {
		title () {
			return this.isValueExist
				? this.getTransactionTypeCaption(this.transactionType) + ' - ' + this._value
				: this.getTransactionTypeCaption(this.transactionType);
		},

		isValueExist () {
			return 'number' === typeof this._value || 'string' === typeof this._value;
		},

		_value () {
			return this.value;
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item {
    min-width: 250px;
}
</style>
