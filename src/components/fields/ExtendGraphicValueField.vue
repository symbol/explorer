/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

<template>
	<component
		:is="extendGraphicComponent"
		:value="value"
		:transactionType="transactionType"
	/>
</template>

<script>
import GraphicComponent from '../graphics/GraphicComponent.vue';
import ExtendTransferValue from '@/components/extend-graphic-value/ExtendTransferValue.vue';
import ExtendNamespaceRegistrationValue from '@/components/extend-graphic-value/ExtendNamespaceRegistrationValue.vue';
import ExtendAliasValue from '@/components/extend-graphic-value/ExtendAliasValue.vue';
import ExtendMosaicSupplyChangeValue from '@/components/extend-graphic-value/ExtendMosaicSupplyChangeValue.vue';
import ExtendMosaicSupplyRevocationValue from '@/components/extend-graphic-value/ExtendMosaicSupplyRevocationValue.vue';
import ExtendMosaicDefinitionValue from '@/components/extend-graphic-value/ExtendMosaicDefinitionValue.vue';
import ExtendKeyLinkValue from '@/components/extend-graphic-value/ExtendKeyLinkValue.vue';
import ExtendSecretLockValue from '@/components/extend-graphic-value/ExtendSecretLockValue.vue';
import ExtendSecretProofValue from '@/components/extend-graphic-value/ExtendSecretProofValue.vue';
import ExtendHashLockValue from '@/components/extend-graphic-value/ExtendHashLockValue.vue';
import ExtendMetadataValue from '@/components/extend-graphic-value/ExtendMetadataValue.vue';
import ExtendAccountOperationRestrictionValue from '@/components/extend-graphic-value/ExtendAccountOperationRestrictionValue.vue';
import ExtendAccountMosaicRestrictionValue from '@/components/extend-graphic-value/ExtendAccountMosaicRestrictionValue.vue';
import ExtendAccountAddressRestrictionValue from '@/components/extend-graphic-value/ExtendAccountAddressRestrictionValue.vue';
import ExtendMosaicGlobalRestrictionValue from '@/components/extend-graphic-value/ExtendMosaicGlobalRestrictionValue.vue';
import { TransactionType } from 'symbol-sdk';
export default {
	extends: GraphicComponent,

	name: 'ExtendGraphicValueField',

	props: {
		value: {
			type: [Array, Object],
			required: true,
			default: () => []
		},
		transactionType: {
			type: [String, Number],
			required: true
		}
	},

	components: {
		ExtendTransferValue,
		ExtendNamespaceRegistrationValue,
		ExtendAliasValue,
		ExtendMosaicSupplyChangeValue,
		ExtendMosaicSupplyRevocationValue,
		ExtendMosaicDefinitionValue,
		ExtendKeyLinkValue,
		ExtendSecretLockValue,
		ExtendSecretProofValue,
		ExtendHashLockValue,
		ExtendMetadataValue,
		ExtendAccountOperationRestrictionValue,
		ExtendAccountMosaicRestrictionValue,
		ExtendAccountAddressRestrictionValue,
		ExtendMosaicGlobalRestrictionValue
	},

	data () {
		return {
			TransactionType
		};
	},

	computed: {
		extendGraphicComponent () {
			switch (this.transactionType) {
			case TransactionType.TRANSFER: return 'ExtendTransferValue';
			case 'outgoing_' + TransactionType.TRANSFER: return 'ExtendTransferValue';
			case 'incoming_' + TransactionType.TRANSFER: return 'ExtendTransferValue';
			case TransactionType.NAMESPACE_REGISTRATION: return 'ExtendNamespaceRegistrationValue';
			case TransactionType.ADDRESS_ALIAS:
			case TransactionType.MOSAIC_ALIAS: return 'ExtendAliasValue';
			case TransactionType.MOSAIC_SUPPLY_CHANGE: return 'ExtendMosaicSupplyChangeValue';
			case TransactionType.MOSAIC_SUPPLY_REVOCATION: return 'ExtendMosaicSupplyRevocationValue';
			case TransactionType.MOSAIC_DEFINITION: return 'ExtendMosaicDefinitionValue';
			case TransactionType.VOTING_KEY_LINK:
			case TransactionType.VRF_KEY_LINK:
			case TransactionType.NODE_KEY_LINK:
			case TransactionType.ACCOUNT_KEY_LINK: return 'ExtendKeyLinkValue';
			case TransactionType.SECRET_LOCK: return 'ExtendSecretLockValue';
			case TransactionType.SECRET_PROOF: return 'ExtendSecretProofValue';
			case TransactionType.HASH_LOCK: return 'ExtendHashLockValue';
			case TransactionType.ACCOUNT_METADATA:
			case TransactionType.MOSAIC_METADATA:
			case TransactionType.NAMESPACE_METADATA: return 'ExtendMetadataValue';
			case TransactionType.ACCOUNT_OPERATION_RESTRICTION: return 'ExtendAccountOperationRestrictionValue';
			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: return 'ExtendAccountMosaicRestrictionValue';
			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: return 'ExtendAccountAddressRestrictionValue';
			case TransactionType.MOSAIC_GLOBAL_RESTRICTION: return 'ExtendMosaicGlobalRestrictionValue';
			}
			return null;
		}
	}

};
</script>
