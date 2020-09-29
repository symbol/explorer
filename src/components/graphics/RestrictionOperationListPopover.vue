<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<TransactionTypeListItem
				v-for="(value, key) in addedRestriction"
				:key="'rolp_' + key"
				:transactionType="value"
				:value="'Added'"
			/>

			<TransactionTypeListItem
				v-for="(value, key) in removedRestriction"
				:key="'rolp_' + key"
				:transactionType="value"
				:value="'Removed'"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';
import TransactionTypeListItem from './TransactionTypeListItem.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	components: {
		TransactionTypeListItem
	},

	props: {
		data: {
			type: Object,
			default: () => ({})
		},

		title: {
			type: String,
			default: 'Table'
		},

		target: {
			type: String,
			required: true
		}
	},
	computed: {
		addedRestriction() {
			return this.data.added;
		},
		removedRestriction() {
			return this.data.removed;
		},
		isAccountAddressRestriction() {
			return this.restriction === TransactionType.ACCOUNT_ADDRESS_RESTRICTION;
		},
		isAccountMosaicRestriction() {
			return this.restriction === TransactionType.ACCOUNT_MOSAIC_RESTRICTION;
		},
		isAccountOperationRestriction() {
			return this.restriction === TransactionType.ACCOUNT_OPERATION_RESTRICTION;
		},
		account() {
			return {
				address: 'TAIWUA6U2O2WVFIWYFKP4D67CY5F4U4CX64LZCY'
			};
		}
	},
	methods: {
		getTranslation(key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>

<style lang="scss" scoped>
.test {
    border: none;
}

.table-list {
    min-width: 250px;

    .key {
        color: $table-title-text-color;
        font-weight: bolder;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .value {
        display:flex;
        font-size: 12px;
        color: $table-text-color;
    }
}
</style>
