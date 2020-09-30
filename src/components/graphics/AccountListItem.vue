<template>
	<b-list-group-item
		class="d-flex justify-content-between align-items-center list-item"
		:title="title"
	>
		<AccountIcon
			hideCaption
			:width="32"
			:height="32"
			:address="account.address"
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
		account: {
			type: Object,
			default: () => ({})
		},

		value: {
			type: [Number, String]
		}
	},

	computed: {
		text() {
			return this.truncString(this.account.address, 5);
		},

		title() {
			return this.account.address;
		},

		isValueExist() {
			return typeof this._value === 'number' || typeof this._value === 'string';
		},

		_value() {
			return this.value || this.account.amount;
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item {
    min-width: 250px;
}
</style>
