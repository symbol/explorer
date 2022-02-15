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
import MosaicSupplyRevocationGraphic from '@/components/transaction-graphic/MosaicSupplyRevocationGraphic.vue';
import SecretLockGraphic from '@/components/transaction-graphic/SecretLockGraphic.vue';
import HashLockGraphic from '@/components/transaction-graphic/HashLockGraphic.vue';
import VrfKeyGraphic from '@/components/transaction-graphic/VrfKeyGraphic.vue';
import AccountKeyLinkGraphic from '@/components/transaction-graphic/AccountKeyLinkGraphic.vue';
import NodeKeyLinkGraphic from '@/components/transaction-graphic/NodeKeyLinkGraphic.vue';
import VotingKeyLinkGraphic from '@/components/transaction-graphic/VotingKeyLinkGraphic.vue';
import SecretProofGraphic from '@/components/transaction-graphic/SecretProofGraphic.vue';
import AccountMetadataGraphic from '@/components/transaction-graphic/AccountMetadataGraphic.vue';
import NamespaceMetadataGraphic from '@/components/transaction-graphic/NamespaceMetadataGraphic.vue';
import MosaicMetadataGraphic from '@/components/transaction-graphic/MosaicMetadataGraphic.vue';
import MosaicGlobalRestrictionGraphic from '@/components/transaction-graphic/MosaicGlobalRestrictionGraphic.vue';
import MosaicAddressRestrictionGraphic from '@/components/transaction-graphic/MosaicAddressRestrictionGraphic.vue';
import AccountOperationRestrictionGraphic from '@/components/transaction-graphic/AccountOperationRestrictionGraphic.vue';
import AccountAddressRestrictionGraphic from '@/components/transaction-graphic/AccountAddressRestrictionGraphic.vue';
import AccountMosaicRestrictionGraphic from '@/components/transaction-graphic/AccountMosaicRestrictionGraphic.vue';
import MultisigAccountModificationGraphic from '@/components/transaction-graphic/MultisigAccountModificationGraphic.vue';
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
		MosaicSupplyRevocationGraphic,
		SecretLockGraphic,
		HashLockGraphic,
		SecretProofGraphic,
		VrfKeyGraphic,
		AccountKeyLinkGraphic,
		NodeKeyLinkGraphic,
		VotingKeyLinkGraphic,
		AccountMetadataGraphic,
		NamespaceMetadataGraphic,
		MosaicMetadataGraphic,
		MosaicGlobalRestrictionGraphic,
		MosaicAddressRestrictionGraphic,
		AccountOperationRestrictionGraphic,
		AccountAddressRestrictionGraphic,
		AccountMosaicRestrictionGraphic,
		MultisigAccountModificationGraphic
	},

	data () {
		return {
			TransactionType
		};
	},

	computed: {
		graphicComponent () {
			switch (this.data?.type) {
			case TransactionType.TRANSFER: return 'TransferGraphic';
			case TransactionType.ADDRESS_ALIAS: return 'AddressAliasGraphic';
			case TransactionType.MOSAIC_ALIAS: return 'MosaicAliasGraphic';
			case TransactionType.NAMESPACE_REGISTRATION: return 'NamespaceRegistrationGraphic';
			case TransactionType.MOSAIC_DEFINITION: return 'MosaicDefinitionGraphic';
			case TransactionType.MOSAIC_SUPPLY_CHANGE: return 'MosaicSupplyChangeGraphic';
			case TransactionType.MOSAIC_SUPPLY_REVOCATION: return 'MosaicSupplyRevocationGraphic';
			case TransactionType.SECRET_LOCK: return 'SecretLockGraphic';
			case TransactionType.HASH_LOCK: return 'HashLockGraphic';
			case TransactionType.SECRET_PROOF: return 'SecretProofGraphic';
			case TransactionType.VRF_KEY_LINK: return 'VrfKeyGraphic';
			case TransactionType.ACCOUNT_KEY_LINK: return 'AccountKeyLinkGraphic';
			case TransactionType.NODE_KEY_LINK: return 'NodeKeyLinkGraphic';
			case TransactionType.VOTING_KEY_LINK: return 'VotingKeyLinkGraphic';
			case TransactionType.MOSAIC_GLOBAL_RESTRICTION: return 'MosaicGlobalRestrictionGraphic';
			case TransactionType.MOSAIC_ADDRESS_RESTRICTION: return 'MosaicAddressRestrictionGraphic';
			case TransactionType.ACCOUNT_OPERATION_RESTRICTION: return 'AccountOperationRestrictionGraphic';
			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: return 'AccountAddressRestrictionGraphic';
			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: return 'AccountMosaicRestrictionGraphic';
			case TransactionType.MULTISIG_ACCOUNT_MODIFICATION: return 'MultisigAccountModificationGraphic';
			case TransactionType.ACCOUNT_METADATA: return 'AccountMetadataGraphic';
			case TransactionType.NAMESPACE_METADATA: return 'NamespaceMetadataGraphic';
			case TransactionType.MOSAIC_METADATA: return 'MosaicMetadataGraphic';
			}
			return null;
		}
	}
};
</script>
