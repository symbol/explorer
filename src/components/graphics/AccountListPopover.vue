<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<AccountListItem
				v-for="(address, index) in accounts"
				:key="'alp'+address + index"
				:address="address"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import AccountListItem from '../graphics/AccountListItem.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountListItem
	},

	props: {
		accounts: {
			type: Array,
			default: () => []
		},

		title: {
			type: String,
			default: 'accounts'
		},

		target: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="scss" scoped>
.account-list {
    min-width: 250px;
}
</style>
