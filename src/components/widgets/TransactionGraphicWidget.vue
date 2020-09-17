<template>
	<Card :loading="loading" v-if="isWidgetShown">
		<template #title>{{getNameByKey('transactionGraphic')}}</template>

		<template #body>
			<div class="body">
				<TransferGraphic v-if="data.type === TransactionType.TRANSFER" v-bind="data" />
				<AddressAliasGraphic v-if="data.type === TransactionType.ADDRESS_ALIAS" v-bind="data" />
				<MosaicAliasGraphic v-if="data.type === TransactionType.MOSAIC_ALIAS" v-bind="data" />
				<NamespaceRegistrationGraphic v-if="data.type === TransactionType.NAMESPACE_REGISTRATION" v-bind="data" />
				<SecretLockGraphic v-if="data.type === TransactionType.SECRET_LOCK" v-bind="data" />
				<HashLockGraphic v-if="data.type === TransactionType.HASH_LOCK" v-bind="data" />
				<VrfKeyGraphic v-if="data.type === TransactionType.VRF_KEY_LINK" v-bind="data" />
				<AccountKeyLinkGraphic v-if="data.type === TransactionType.ACCOUNT_KEY_LINK" v-bind="data" />
				<NodeKeyLinkGraphic v-if="data.type === TransactionType.NODE_KEY_LINK" v-bind="data" />
				<VotingKeyLinkGraphic v-if="data.type === TransactionType.VOTING_KEY_LINK" v-bind="data" />
			</div>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import TransferGraphic from '@/components/transaction-graphic/TransferGraphic.vue';
import AddressAliasGraphic from '@/components/transaction-graphic/AddressAliasGraphic.vue';
import MosaicAliasGraphic from '@/components/transaction-graphic/MosaicAliasGraphic.vue';
import NamespaceRegistrationGraphic from '@/components/transaction-graphic/NamespaceRegistrationGraphic.vue';
import SecretLockGraphic from '@/components/transaction-graphic/SecretLockGraphic.vue';
import HashLockGraphic from '@/components/transaction-graphic/HashLockGraphic.vue';
import VrfKeyGraphic from '@/components/transaction-graphic/VrfKeyGraphic.vue';
import AccountKeyLinkGraphic from '@/components/transaction-graphic/AccountKeyLinkGraphic.vue';
import NodeKeyLinkGraphic from '@/components/transaction-graphic/NodeKeyLinkGraphic.vue';
import VotingKeyLinkGraphic from '@/components/transaction-graphic/VotingKeyLinkGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	props: {
		managerGetter: String
	},

	components: {
		Card,
		TransferGraphic,
		AddressAliasGraphic,
		MosaicAliasGraphic,
		NamespaceRegistrationGraphic,
		SecretLockGraphic,
		HashLockGraphic,
		VrfKeyGraphic,
		AccountKeyLinkGraphic,
		NodeKeyLinkGraphic,
		VotingKeyLinkGraphic
	},

	data() {
		return {
			TransactionType
		};
	},

	computed: {
		isWidgetShown() {
			return this.data.type === TransactionType.TRANSFER ||
        this.data.type === TransactionType.ADDRESS_ALIAS ||
        this.data.type === TransactionType.MOSAIC_ALIAS ||
        this.data.type === TransactionType.NAMESPACE_REGISTRATION ||
        this.data.type === TransactionType.SECRET_LOCK ||
        this.data.type === TransactionType.HASH_LOCK ||
        this.data.type === TransactionType.VRF_KEY_LINK ||
        this.data.type === TransactionType.ACCOUNT_KEY_LINK ||
		this.data.type === TransactionType.NODE_KEY_LINK ||
		this.data.type === TransactionType.VOTING_KEY_LINK;
		},

		data() {
			return this.$store.getters[this.managerGetter].data;
		},

		loading() {
			return this.$store.getters[this.managerGetter].loading;
		},

		error() {
			return this.$store.getters[this.managerGetter].error;
		}
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    justify-content: center;
}
</style>
