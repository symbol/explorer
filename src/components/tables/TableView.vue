<script>
import Age from '../fields/Age.vue';
import Constants from '../../config/constants';
import Decimal from '@/components/fields/Decimal.vue';
import Truncate from '@/components/fields/Truncate.vue';
import Boolean from '@/components/fields/Boolean.vue';

export default {
	components: {
		Age,
		Decimal,
		Truncate,
		Boolean
	},
	props: {
		height: {
			type: Number
		},

		emptyDataMessage: {
			type: String,
			default: 'nothingToShow'
		}
	},

	data () {
		return {
			componentType: 'list',
			clickableKeys: [
				'account',
				'block',
				'address',
				'height',
				'mosaic',
				'namespace',
				'namespaceName',
				'linkedNamespace',
				'mosaicAliasNames_',
				'accountAliasNames_',
				'aliasAddress',
				'aliasMosaic',
				'transaction',
				'harvester',
				'beneficiaryAddress',
				'mosaicId',
				'namespaceId',
				'parentId',
				'transactionHash',

				'addressHeight',
				'publicKeyHeight',
				'importanceHeight',
				'multisigAddresses_',
				'cosignatoryAddresses_',

				'signer',
				'signerPublicKey',
				'recipient',
				'ownerAddress',
				'blockHeight',
				'endHeight',
				'startHeight',

				'lastActivity',
				'recalculationBlock',
				'sourceAddress',
				'targetAddress',
				'targetMosaicId',
				'targetMosaicAliasNames_',
				'targetNamespaceId',
				'unresolved',
				'addressResolutionEntries_',
				'mosaicResolutionEntries_',
				'restrictionMosaicValues_',
				'restrictionAddressValues_',
				'referenceMosaicId',
				'restrictionAddressAdditions_',
				'restrictionAddressDeletions_',
				'restrictionMosaicAdditions_',
				'restrictionMosaicDeletions_',
				'addressAdditions_',
				'addressDeletions_',
				'linkedAccountAddress',
				'ownerAddress',
				'senderAddress',
				'linkedAddress',
				'nodeAddress',
				'vrfAddress',
				'voting_',

				'namespaceArtifactId',
				'mosaicArtifactId',
				'nodePublicKey'
			],
			disableClickValues: [...Object.values(Constants.Message)],
			changeDecimalColor: [
				'amount',
				'fee',
				'relativeAmount',
				'feeMultiplier',
				'difficulty',
				'balance',
				'totalVotingBalance'
			],
			allowArrayToView: [
				'linkedNamespace',
				'cosignatoryAddresses',
				'multisigAddresses',
				'restrictionAddressValues',
				'restrictionMosaicValues',
				'restrictionTransactionValues',
				'restrictionAddressAdditions',
				'restrictionAddressDeletions',
				'restrictionMosaicAdditions',
				'restrictionMosaicDeletions',
				'restrictionOperationAdditions',
				'restrictionOperationDeletions',
				'addressAdditions',
				'addressDeletions',
				'voting',
				'addressResolutionEntries',
				'mosaicResolutionEntries',
				'stateHashSubCacheMerkleRoots',
				'accountAliasNames',
				'mosaicAliasNames',
				'targetMosaicAliasNames'
			],
			valuesToTranslate: [
				'newRestrictionType',
				'previousRestrictionType',
				'restrictionType',
				'mosaicRestrictionType'
			],
			Address: [
				'address',
				'ownerAddress',
				'recipient',
				'signer',
			]
		};
	},

	computed: {
		emptyDataMessageFormatted () {
			return this.$store.getters['ui/getNameByKey'](this.emptyDataMessage);
		}
	},

	methods: {
		translateValue (key, value) {
			if (this.valuesToTranslate.includes(key))
				return this.$store.getters['ui/getNameByKey'](value);
			return value;
		},

		isKeyClickable (itemKey) {
			return -1 !== this.clickableKeys.indexOf(itemKey);
		},

		isValueClickable (item) {
			return -1 === this.disableClickValues.indexOf(item);
		},

		isDateField (itemKey) {
			return 'timestamp' === itemKey || 'deadline' === itemKey;
		},

		isDecimal (itemKey) {
			return -1 !== this.changeDecimalColor.indexOf(itemKey);
		},

		isMosaics (itemKey) {
			return 'mosaics' === itemKey;
		},

		isAge (itemKey) {
			return 'age' === itemKey || 'lastStatusCheck' === itemKey;
		},

		isTransactionType (itemKey) {
			return 'transactionType' === itemKey || 'restrictionOperationAdditions_' === itemKey || 'restrictionOperationDeletions_' === itemKey;
		},

		isBlockHeightWithFinalizedStatus (itemKey) {
			return 'height' === itemKey || 'blockHeight' === itemKey || 'startHeight' === itemKey || 'endHeight' === itemKey;
		},

		isArrayField (itemKey) {
			return -1 !== this.allowArrayToView.indexOf(itemKey);
		},

		isAddressField (itemKey) {
			return -1 !== this.Address.indexOf(itemKey);
		},

		isTruncate (key) {
			return (
				'harvester' === key ||
                'address' === key ||
                'signer' === key ||
				'recipient' === key ||
				'publicKey' === key ||
				'signerPublicKey' === key ||
				'nodePublicKey' === key ||
				'mainPublicKey' === key ||
                'transactionHash' === key ||
                'ownerAddress' === key ||
                'host' === key ||
                'friendlyName' === key ||
                'multisigAddresses_' === key ||
				'cosignatoryAddresses_' === key ||
				'addressAdditions_' === key ||
				'addressDeletions_' === key
			);
		},

		isWordBreakable (key) {
			return this.isTruncate(key) ||
				('string' === typeof key
					? (
						key.toLowerCase().includes('key') ||
						key.toLowerCase().includes('hash') ||
						key.toLowerCase().includes('id') ||
						key.toLowerCase().includes('hex')
					)
					: false
				);
		},

		isBoolean (key) {
			return (
				'connectionStatus' === key ||
                'apiNodeStatus' === key ||
				'databaseStatus' === key ||
				'isHttpsEnabled' === key ||
				'isAvailable' === key
			);
		},

		isAggregateInnerTransaction (itemKey) {
			return 'transactionBody' === itemKey;
		},

		isItemShown (itemKey, item) {
			if (this.isArrayField(itemKey))
				return 0 !== item?.length;

			return null != item;
		},

		onItemClick (itemKey, item) {
			if (this.isKeyClickable(itemKey) && this.isValueClickable(item)) {
				this.$store.dispatch('ui/openPage', {
					pageName: itemKey,
					param: item
				});
			}
		},

		getItemHref (itemKey, item) {
			if (this.isValueClickable(item)) {
				return this.$store.getters['ui/getPageHref']({
					pageName: itemKey,
					param: item
				});
			}
		},

		getKeyName (key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>

<style lang="scss">
.table-view {
    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
        background-color: transparent;
        font-size: 13px;
        color: var(--table-content-text);
    }

    thead {
        border-radius: 4px;
    }

    thead th {
        vertical-align: middle;
        border: 0 none;
        padding: 12px 6px 12px 6px;
        outline: none;
    }

    .empty-data {
        font-size: 14px;
        color: $card-error-text-color;
        display: flex;
        justify-content: center;
    }

    .table-title-item {
        vertical-align: middle;
        padding: 12px 6px 12px 6px;
        color: var(--text-color);
        font-weight: bolder;
        outline: none;
        font-size: 16px;
        letter-spacing: unset;
    }

    .table-titles-ver {
        width: 30%;
        max-width: 200px;
    }

    .ex-table-striped tbody tr:hover {
        background-color: $table-hover-color;
    }

    .ex-table-striped tbody tr:nth-child(odd) td {
        background-color: $table-striped-color-first;
    }

    .ex-table-striped tbody tr:nth-child(even) td {
        background-color: $table-striped-color-second;
    }

    .table-head-cell {
        position: relative;
    }

    .table-head-cell::before {
        content: "&nbsp;";
        visibility: hidden;
    }

    .table-head-cell span {
        position: absolute;
        left: 5px;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
    }

    .table-cell {
        border-bottom: 1px solid var(--sub-card-border);
        font-weight: none;
        padding: 10px 5px;
        min-height: 50px;
        word-break: normal;
        min-width: 50px;
        max-width: 200px;
    }

    .date, .deadline, .age, .height {
        word-break: normal;
    }

    @media screen and (max-width: 40em) {
        .date, .deadline {
            width: 85px;
        }
    }

    .table-item-clickable {
        color: var(--clickable-text);
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;

        a {
            font-weight: 600;
        }
    }

    .table-titles {
        background-color: rgba(52, 40, 104, 0.05);
    }

    .break-all {
        word-break: break-all;
    }
}
</style>
