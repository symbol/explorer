<template>
	<b-list-group-item
		class="d-flex justify-content-between align-items-center list-item"
		:title="title"
	>
		<AccountIcon
			hideCaption
			:width="32"
			:height="32"
			:address="address"
		/>
		{{ text }}
		<b-badge v-if="isValueExist" variant="primary" pill>{{ _value }}</b-badge>
		<div v-else> &nbsp; </div>
	</b-list-group-item>
</template>

<script>
import AccountIcon from '../graphics/AccountIcon.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon
	},

	props: {
		address: {
			type: String,
			default: ''
		},

		value: {
			type: [Number, String]
		}
	},

	computed: {
		text () {
			return this.truncString(this.address, 5);
		},

		title () {
			return this.address;
		},

		isValueExist () {
			return 'number' === typeof this._value || 'string' === typeof this._value;
		},

		_value () {
			return this.value || this.amount;
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item {
    min-width: 250px;
    background-color: var(--sub-card-bg);
    border: 1px solid var(--sub-card-border);
    color: var(--text-color);
}
</style>
