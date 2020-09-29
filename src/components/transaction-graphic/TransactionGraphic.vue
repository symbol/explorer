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
import MosaicSupplyChangeGraphic from '@/components/transaction-graphic/MosaicSupplyChangeGraphic.vue';
import SecretLockGraphic from '@/components/transaction-graphic/SecretLockGraphic.vue';
import HashLockGraphic from '@/components/transaction-graphic/HashLockGraphic.vue';
import VrfKeyGraphic from '@/components/transaction-graphic/VrfKeyGraphic.vue';
import AccountKeyLinkGraphic from '@/components/transaction-graphic/AccountKeyLinkGraphic.vue';
import NodeKeyLinkGraphic from '@/components/transaction-graphic/NodeKeyLinkGraphic.vue';
import VotingKeyLinkGraphic from '@/components/transaction-graphic/VotingKeyLinkGraphic.vue';
import SecretProofGraphic from '@/components/transaction-graphic/SecretProofGraphic.vue';
import AccountOperationRestrictionGraphic from '@/components/transaction-graphic/AccountOperationRestrictionGraphic.vue';
import AccountAddressRestrictionGraphic from '@/components/transaction-graphic/AccountAddressRestrictionGraphic.vue';
import AccountMosaicRestrictionGraphic from '@/components/transaction-graphic/AccountMosaicRestrictionGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	props: {
		data: {
			type: Object,
			required: true,
			default: () => {}
		}
	},

	components: {
		TransferGraphic,
		AddressAliasGraphic,
		MosaicAliasGraphic,
		NamespaceRegistrationGraphic,
		MosaicDefinitionGraphic,
		MosaicSupplyChangeGraphic,
		SecretLockGraphic,
		HashLockGraphic,
		SecretProofGraphic,
		VrfKeyGraphic,
		AccountKeyLinkGraphic,
		NodeKeyLinkGraphic,
		VotingKeyLinkGraphic,
		AccountOperationRestrictionGraphic,
		AccountAddressRestrictionGraphic,
		AccountMosaicRestrictionGraphic
	},

	data() {
		return {
			TransactionType
		};
	},

	computed: {
		graphicComponent() {
			switch (this.data?.type) {
			case TransactionType.TRANSFER: return 'TransferGraphic';
			case TransactionType.ADDRESS_ALIAS: return 'AddressAliasGraphic';
			case TransactionType.MOSAIC_ALIAS: return 'MosaicAliasGraphic';
			case TransactionType.NAMESPACE_REGISTRATION: return 'NamespaceRegistrationGraphic';
			case TransactionType.MOSAIC_DEFINITION: return 'MosaicDefinitionGraphic';
			case TransactionType.MOSAIC_SUPPLY_CHANGE: return 'MosaicSupplyChangeGraphic';
			case TransactionType.SECRET_LOCK: return 'SecretLockGraphic';
			case TransactionType.HASH_LOCK: return 'HashLockGraphic';
			case TransactionType.SECRET_PROOF: return 'SecretProofGraphic';
			case TransactionType.VRF_KEY_LINK: return 'VrfKeyGraphic';
			case TransactionType.ACCOUNT_KEY_LINK: return 'AccountKeyLinkGraphic';
			case TransactionType.NODE_KEY_LINK: return 'NodeKeyLinkGraphic';
			case TransactionType.VOTING_KEY_LINK: return 'VotingKeyLinkGraphic';
			case TransactionType.ACCOUNT_OPERATION_RESTRICTION: return 'AccountOperationRestrictionGraphic';
			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: return 'AccountAddressRestrictionGraphic';
			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: return 'AccountMosaicRestrictionGraphic';
			}
			return null;
		}
	}
};
</script>
