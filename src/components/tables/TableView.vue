<script>
import Age from '../fields/Age.vue'
import Constants from '../../config/constants'
import Decimal from '@/components/fields/Decimal.vue'
import Truncate from '@/components/fields/Truncate.vue'

export default {
  components: {
    Age,
    Decimal,
    Truncate
  },
  props: {
    height: {
      type: Number
    },

    emptyDataMessage: {
      type: String,
      default: 'nothing_to_show'
    }
  },

  data() {
    return {
      componentType: 'list',
      clickableKeys: [
        'account',
        'block',
        'address',
        'height',
        'mosaic',
        'namespace',
        'namespace_name',
        'linked_namespace',
        'mosaic_alias_name',
        'account_alias_name',
        'alias_address',
        'alias_mosaic',
        'linked_account_key',
        'transaction',
        'harvester',
        'mosaic_id',
        'namespace_id',
        'parent_id',
        'transaction_hash',

        'address_height',
        'public_key_height',
        'importance_height',
        'multisigAccounts_',

        'signer',
        'recipient',
        'owner_address',
        'block_height',
        'end_height',
        'start_height',
        'remote_account_address',
        'target_public_address',

        'last_activity',
        'recalculation_block',
        'sender_address',
        'target_address',
        'target_mosaic_id',
        'target_namespace_id',
        'unresolved',
        'address_resolution_entries',
        'mosaic_resolution_entries',
        'restriction_mosaic_values',
        'restriction_address_values',
        'reference_mosaic_id',
        'restriction_address_additions',
        'restriction_address_deletions',
        'restriction_mosaic_additions',
        'restriction_mosaic_deletions',
        'public_key_additions',
        'public_key_deletions'
      ],
      disableClickValues: [...Object.values(Constants.Message)],
      changeDecimalColor: [
        'amount',
        'fee',
        'relative_amount',
        'fee_multiplier',
        'difficulty',
        'balance'
      ],
      allowArrayToView: [
        'linked_namespace',
        'cosignatories',
        'multisig_accounts',
        'restriction_address_values',
        'restriction_mosaic_values',
        'restriction_transaction_values',
        'restriction_address_additions',
        'restriction_address_deletions',
        'restriction_mosaic_additions',
        'restriction_mosaic_deletions',
        'restriction_operation_additions',
        'restriction_operation_deletions',
        'public_key_additions',
        'public_key_deletions'
      ]
    }
  },

  computed: {
    emptyDataMessageFormatted() {
      return this.$store.getters['ui/getNameByKey'](
        this.emptyDataMessage
      )
    }
  },

  methods: {
    isKeyClickable(itemKey) {
      return this.clickableKeys.indexOf(itemKey) !== -1
    },

    isValueClickable(item) {
      return this.disableClickValues.indexOf(item) === -1
    },

    isDecimal(itemKey) {
      return this.changeDecimalColor.indexOf(itemKey) !== -1
    },

    isMosaics(itemKey) {
      return itemKey === 'mosaics'
    },

    isAge(itemKey) {
      return itemKey === 'age'
    },

    isTransactionType(itemKey) {
      return itemKey === 'transaction_descriptor'
    },

    isArrayField(itemKey) {
      return this.allowArrayToView.indexOf(itemKey) !== -1
    },

    isTruncate(key) {
      return (
        key === 'harvester' ||
                key === 'address' ||
                key === 'signer' ||
                key === 'recipient' ||
                key === 'transaction_hash' ||
                key === 'owner_address' ||
                key === 'host' ||
                key === 'friendly_name' ||
                key === 'multisigAccounts_'
      )
    },

    isAggregateInnerTransaction(itemKey) {
      return itemKey === 'transactionBody'
    },

    isItemShown(itemKey, item) {
      if (this.isArrayField(itemKey)) return item.length !== 0

      return item != null
    },

    onItemClick(itemKey, item) {
      if (this.isKeyClickable(itemKey) && this.isValueClickable(item)) {
        this.$store.dispatch(`ui/openPage`, {
          pageName: itemKey,
          param: item
        })
      }
    },

    getItemHref(itemKey, item) {
      if (this.isValueClickable(item)) {
        return this.$store.getters[`ui/getPageHref`]({
          pageName: itemKey,
          param: item
        })
      }
    },

    getKeyName(key) {
      return this.$store.getters['ui/getNameByKey'](key)
    }
  }
}
</script>

<style lang="scss">
.table-view {
    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
        background-color: transparent;
        font-size: 12px;
        color: $table-text-color;
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
        color: $table-text-color-light;
        display: flex;
        justify-content: center;
    }

    .table-title-item {
        vertical-align: middle;
        padding: 12px 6px 12px 6px;
        color: $table-title-text-color;
        font-weight: bolder;
        outline: none;
        font-size: 12px;
        letter-spacing: 1px;
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
        text-overflow: ellipsis;
    }

    .table-cell {
        border-bottom: 1px solid #dadee6;
        font-weight: none;
        padding: 10px 5px;
        min-height: 50px;
        word-break: break-all;
        min-width: 50px;
        max-width: 300px;
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
        color: var(--primary);
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
}
</style>
