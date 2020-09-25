<template>
    <b-list-group-item
        class="d-flex justify-content-between align-items-center list-item"
        :title="title"
    >
        <IconTransactions
            :width="32"
            :height="32"
            :title="transactionType"
        />
        {{ text }}
        <b-badge v-if="isValueExist" variant="primary" pill>{{ _value }}</b-badge>
		<div v-else> &nbsp; </div>
    </b-list-group-item>
</template>

<script>
import IconTransactions from 'vue-material-design-icons/Send.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		IconTransactions
	},

	props: {
		transactionType: {
			type: Number,
		},

		value: {
			type: [Number, String]
		}
	},

	computed: {
		text() {
			return this.truncString(this.getTransactionTypeCaption(this.transactionType), 5);
		},

		title() {
			return this.getTransactionTypeCaption(this.transactionType);
		},

		isValueExist() {
			return typeof this._value === 'number' || typeof this._value === 'string';
		},

		_value() {
			return this.value;
		}
	}
}
</script>

<style lang="scss" scoped>
.list-item {
    min-width: 250px;
}
</style>