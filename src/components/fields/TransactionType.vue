<template>
	<div class="transaction-type">
		<div v-if="iconUrl" class="icon">
			<img :src="iconUrl" :class="iconSizeClass" />
		</div>
		<div v-if="!hideCaption" class="text">
			{{ transactionText }}
		</div>
	</div>
</template>

<script>
import IconTransfer from '../../styles/img/transfer.png';
import IconTransferIncoming from '../../styles/img/tx-incoming.png';
import IconTransferOutgoing from '../../styles/img/tx-outgoing.png';
import IconLock from '../../styles/img/lock.png';
import IconNamespace from '../../styles/img/namespace.png';
import IconMosaic from '../../styles/img/mosaic.png';
import IconRestriction from '../../styles/img/restriction.png';
import IconMultisig from '../../styles/img/multisig.png';
import IconMetadata from '../../styles/img/metadata.png';
import IconLink from '../../styles/img/account-link.png';
import IconAggregateBond from '../../styles/img/aggregate-bond.png';
import IconAggregateCompleted from '../../styles/img/aggregate-completed.png';
import IconRevoke from '../../styles/img/revoke.png';
import { TransactionType } from 'symbol-sdk';

export default {
	props: {
		value: {
			type: [String, Number],
			required: true
		},

		hideCaption: {
			type: Boolean,
			default: false
		},

		size: {
			type: String,
			default: 'medium'
		}
	},

	data () {
		return {
			IconTransfer,
			IconTransferIncoming,
			IconTransferOutgoing,
			IconLock,
			IconNamespace,
			IconMosaic,
			IconRestriction,
			IconMultisig,
			IconMetadata,
			IconLink,
			IconAggregateBond,
			IconAggregateCompleted,
			IconRevoke
		};
	},

	computed: {
		iconUrl () {
			switch (this.extractTransactionType(this.value)) {
			case TransactionType.TRANSFER:
				if (this.value.toString().toLowerCase()
					.includes('incoming'))
					return this.IconTransferIncoming;
				if (this.value.toString().toLowerCase()
					.includes('outgoing'))
					return this.IconTransferOutgoing;
				return this.IconTransfer;
			case TransactionType.NAMESPACE_REGISTRATION:
			case TransactionType.ADDRESS_ALIAS:
			case TransactionType.MOSAIC_ALIAS:
				return this.IconNamespace;
			case TransactionType.MOSAIC_DEFINITION:
			case TransactionType.MOSAIC_SUPPLY_CHANGE:
				return this.IconMosaic;
			case TransactionType.MOSAIC_SUPPLY_REVOCATION:
				return this.IconRevoke;
			case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
				return this.IconMultisig;
			case TransactionType.AGGREGATE_COMPLETE:
				return this.IconAggregateCompleted;
			case TransactionType.AGGREGATE_BONDED:
				return this.IconAggregateBond;
			case TransactionType.HASH_LOCK:
			case TransactionType.SECRET_LOCK:
			case TransactionType.SECRET_PROOF:
				return this.IconLock;
			case TransactionType.ACCOUNT_KEY_LINK:
			case TransactionType.VOTING_KEY_LINK:
			case TransactionType.VRF_KEY_LINK:
			case TransactionType.NODE_KEY_LINK:
				return this.IconLink;
			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
			case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
			case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
			case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
				return this.IconRestriction;
			case TransactionType.ACCOUNT_METADATA:
			case TransactionType.MOSAIC_METADATA:
			case TransactionType.NAMESPACE_METADATA:
				return this.IconMetadata;
			default:
				return null;
			}
		},

		transactionText () {
			const transactionType = this.value.toString()
				.replace('incoming_', '')
				.replace('outgoing_', '');

			const transactionDescriptor = `transactionDescriptor_${transactionType}`;

			return this.$store.getters['ui/getNameByKey'](transactionDescriptor);
		},

		iconSizeClass () {
			return 'icon-' + this.size;
		}
	},

	methods: {
		extractTransactionType (value) {
			if ('string' === typeof value)
				return Number(value.split('_').pop());

			return value;
		}
	}
};
</script>

<style lang="scss" scoped>
.transaction-type {
    display: flex;
    text-transform: capitalize;

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        filter: var(--icon-invert);

        .icon-small {
            height: 12px;
            width: 12px;
            margin-right: 4px;
        }

        .icon-medium {
            height: 25px;
            width: 25px;
            margin: 5px;
        }
    }

    .text {
        display: flex;
        align-items: center;
        word-break: normal;
    }
}
</style>
