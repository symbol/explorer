<template>
	<component
		:is="graphicComponent"
		v-bind="data"
	/>
</template>

<script>
import TransferGraphic from '@/components/transaction-graphic/TransferGraphic.vue';
import AddressAliasGraphic from '@/components/transaction-graphic/AddressAliasGraphic.vue';
import MosaicAliasGraphic from '@/components/transaction-graphic/MosaicAliasGraphic.vue';
import NamespaceRegistrationGraphic from '@/components/transaction-graphic/NamespaceRegistrationGraphic.vue';
import MosaicDefinitionGraphic from '@/components/transaction-graphic/MosaicDefinitionGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	props: {
		data: {
			type: Object,
			required: true
		}
	},

	components: {
		TransferGraphic,
		AddressAliasGraphic,
		MosaicAliasGraphic,
		NamespaceRegistrationGraphic,
		MosaicDefinitionGraphic
	},

	data() {
		return {
			TransactionType
		};
	},

	computed: {
		graphicComponent() {
			switch(this.data?.type) {
				case TransactionType.TRANSFER: return 'TransferGraphic';
				case TransactionType.ADDRESS_ALIAS: return 'AddressAliasGraphic';
				case TransactionType.MOSAIC_ALIAS: return 'MosaicAliasGraphic';
				case TransactionType.NAMESPACE_REGISTRATION: return 'NamespaceRegistrationGraphic';
				case TransactionType.MOSAIC_DEFINITION: return 'MosaicDefinitionGraphic';
			}
			return null;
		}
	}
};
</script>

