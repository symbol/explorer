import { TransactionType } from 'symbol-sdk'

export const transaction = [
  {
    label: 'Recent',
    icon: 'mdi-clock-outline',
    value: {}
  },
  {
    label: 'Unconfirmed',
    icon: 'mdi-dots-horizontal',
    value: { group: 'Unconfirmed' }
  },
  {
    label: 'Transfer',
    icon: 'mdi-swap-vertical',
    value: { transactionTypes: [TransactionType.TRANSFER] }
  },
  {
    label: 'Account',
    icon: 'mdi-account',
    value: {
      transactionTypes: [
        TransactionType.ADDRESS_ALIAS,
        TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
        TransactionType.ACCOUNT_ADDRESS_RESTRICTION,
        TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
        TransactionType.ACCOUNT_OPERATION_RESTRICTION,
        TransactionType.ACCOUNT_LINK,
        TransactionType.ACCOUNT_METADATA
      ]
    }
  },
  {
    label: 'Aggregate',
    icon: 'mdi-gamepad-circle',
    value: {
      transactionTypes: [
        TransactionType.AGGREGATE_COMPLETE,
        TransactionType.AGGREGATE_BONDED,
        TransactionType.HASH_LOCK
      ]
    }
  },
  {
    label: 'Alias',
    icon: 'mdi-comment-account',
    value: {
      transactionTypes: [
        TransactionType.ADDRESS_ALIAS,
        TransactionType.MOSAIC_ALIAS
      ]
    }
  },
  {
    label: 'Metadata',
    icon: 'mdi-xml',
    value: {
      transactionTypes: [
        TransactionType.ACCOUNT_METADATA,
        TransactionType.MOSAIC_METADATA,
        TransactionType.NAMESPACE_METADATA
      ]
    }
  },
  {
    label: 'Mosaic',
    icon: 'mdi-circle',
    value: {
      transactionTypes: [
        TransactionType.MOSAIC_ALIAS,
        TransactionType.MOSAIC_DEFINITION,
        TransactionType.MOSAIC_SUPPLY_CHANGE,
        TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
        TransactionType.MOSAIC_ADDRESS_RESTRICTION,
        TransactionType.MOSAIC_GLOBAL_RESTRICTION,
        TransactionType.MOSAIC_METADATA
      ]
    }
  },
  {
    label: 'Namespace',
    icon: 'mdi-tag',
    value: {
      transactionTypes: [
        TransactionType.NAMESPACE_REGISTRATION,
        TransactionType.NAMESPACE_METADATA
      ]
    }
  },
  {
    label: 'Restriction',
    icon: 'mdi-alert',
    value: {
      transactionTypes: [
        TransactionType.ACCOUNT_ADDRESS_RESTRICTION,
        TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
        TransactionType.ACCOUNT_OPERATION_RESTRICTION,
        TransactionType.MOSAIC_ADDRESS_RESTRICTION,
        TransactionType.MOSAIC_GLOBAL_RESTRICTION
      ]
    }
  },
  {
    label: 'Secret',
    icon: 'mdi-lock',
    value: {
      transactionTypes: [
        TransactionType.SECRET_LOCK,
        TransactionType.SECRET_PROOF
      ]
    }
  }
]
