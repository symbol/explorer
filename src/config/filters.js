import {
	TransactionType,
	TransactionGroup,
	AliasType,
	NamespaceRegistrationType,
	MosaicId,
	AccountOrderBy,
	MetadataType,
	MosaicRestrictionEntryType,
	ReceiptType
} from 'symbol-sdk';
import http from '../infrastructure/http';
import Constants from '../config/constants';

const customTransactionReceiptFilter = {
	balanceTransfer: {
		receiptTypes: [
			ReceiptType.Mosaic_Rental_Fee,
			ReceiptType.Namespace_Rental_Fee
		],
		receiptTransactionStatementType: Constants.ReceiptTransactionStatamentType.BalanceTransferReceipt
	},
	balanceChange: {
		receiptTypes: [
			ReceiptType.Harvest_Fee,
			ReceiptType.LockHash_Created,
			ReceiptType.LockHash_Completed,
			ReceiptType.LockHash_Expired,
			ReceiptType.LockSecret_Created,
			ReceiptType.LockSecret_Completed,
			ReceiptType.LockSecret_Expired
		],
		receiptTransactionStatementType: Constants.ReceiptTransactionStatamentType.BalanceChangeReceipt
	},
	artifactExpiry: {
		receiptTypes: [
			ReceiptType.Mosaic_Expired,
			ReceiptType.Namespace_Expired,
			ReceiptType.Namespace_Deleted
		],
		receiptTransactionStatementType: Constants.ReceiptTransactionStatamentType.ArtifactExpiryReceipt
	},
	inflation: {
		receiptTypes: [
			ReceiptType.Inflation
		],
		receiptTransactionStatementType: Constants.ReceiptTransactionStatamentType.InflationReceipt
	}
};

export const transaction = [
	{
		label: 'Recent',
		icon: 'mdi-clock-outline',
		value: {}
	},
	{
		label: 'Unconfirmed',
		icon: 'mdi-dots-horizontal',
		value: { group: TransactionGroup.Unconfirmed }
	},
	{
		label: 'Partial',
		icon: 'mdi-dots-horizontal',
		value: { group: TransactionGroup.Partial }
	},
	{
		label: 'Transfer',
		icon: 'mdi-swap-vertical',
		value: { type: [TransactionType.TRANSFER] }
	},
	{
		label: 'Account',
		icon: 'mdi-account',
		value: {
			type: [
				TransactionType.ADDRESS_ALIAS,
				TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
				TransactionType.ACCOUNT_ADDRESS_RESTRICTION,
				TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
				TransactionType.ACCOUNT_OPERATION_RESTRICTION,
				TransactionType.ACCOUNT_KEY_LINK,
				TransactionType.ACCOUNT_METADATA,
				TransactionType.VRF_KEY_LINK,
				TransactionType.VOTING_KEY_LINK,
				TransactionType.NODE_KEY_LINK
			]
		}
	},
	{
		label: 'Aggregate',
		icon: 'mdi-gamepad-circle',
		value: {
			type: [
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
			type: [
				TransactionType.ADDRESS_ALIAS,
				TransactionType.MOSAIC_ALIAS
			]
		}
	},
	{
		label: 'Metadata',
		icon: 'mdi-xml',
		value: {
			type: [
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
			type: [
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
			type: [
				TransactionType.NAMESPACE_REGISTRATION,
				TransactionType.NAMESPACE_METADATA
			]
		}
	},
	{
		label: 'Restriction',
		icon: 'mdi-alert',
		value: {
			type: [
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
			type: [
				TransactionType.SECRET_LOCK,
				TransactionType.SECRET_PROOF
			]
		}
	},
	{
		label: 'Key Link',
		icon: 'mdi-link',
		value: {
			type: [
				TransactionType.VOTING_KEY_LINK,
				TransactionType.VRF_KEY_LINK,
				TransactionType.NODE_KEY_LINK,
				TransactionType.ACCOUNT_KEY_LINK
			]
		}
	}
];

export const account = [
	{
		label: 'Recent',
		icon: 'mdi-clock-outline',
		value: {}
	},
	{
		label: 'Rich List',
		icon: 'mdi-circle',
		value: {
			orderBy: AccountOrderBy.Balance,
			mosaicId: new MosaicId(http.networkCurrency.mosaicId)
		}
	}
];

export const namespace = [
	{
		label: 'Recent',
		icon: 'mdi-clock-outline',
		value: {}
	},
	{
		label: 'Address Alias',
		icon: 'mdi-account',
		value: {
			aliasType: AliasType.Address
		}
	},
	{
		label: 'Mosaic Alias',
		icon: 'mdi-circle',
		value: {
			aliasType: AliasType.Mosaic
		}
	},
	{
		label: 'Root',
		icon: 'mdi-tag',
		value: {
			registrationType: NamespaceRegistrationType.RootNamespace
		}
	},
	{
		label: 'Sub',
		icon: 'mdi-tag',
		value: {
			registrationType: NamespaceRegistrationType.SubNamespace
		}
	}
];

export const metadata = [
	{
		label: 'Recent',
		icon: 'mdi-clock-outline',
		value: {}
	},
	{
		label: 'Address Alias',
		icon: 'mdi-account',
		value: {
			metadataType: MetadataType.Account
		}
	},
	{
		label: 'Mosaic Alias',
		icon: 'mdi-circle',
		value: {
			metadataType: MetadataType.Mosaic
		}
	},
	{
		label: 'Namespace',
		icon: 'mdi-tag',
		value: {
			metadataType: MetadataType.Namespace
		}
	}
];

export const mosaicRestriction = [
	{
		label: 'Mosaic Global Restriction',
		icon: 'mdi-alert',
		value: {
			entryType: MosaicRestrictionEntryType.GLOBAL
		}
	},
	{
		label: 'Mosaic Address Restriction',
		icon: 'mdi-account',
		value: {
			entryType: MosaicRestrictionEntryType.ADDRESS
		}
	}
];

export const nodeRoles = [
	{
		label: 'All Nodes',
		icon: '',
		value: {
			rolesRaw: null
		}
	},
	{
		label: Constants.RoleType[1],
		icon: '',
		value: {
			rolesRaw: 1
		}
	},
	{
		label: Constants.RoleType[2],
		icon: '',
		value: {
			rolesRaw: 2
		}
	},
	{
		label: Constants.RoleType[3],
		icon: '',
		value: {
			rolesRaw: 3
		}
	},
	{
		label: Constants.RoleType[4],
		icon: '',
		value: {
			rolesRaw: 4
		}
	},
	{
		label: Constants.RoleType[5],
		icon: '',
		value: {
			rolesRaw: 5
		}
	},
	{
		label: Constants.RoleType[6],
		icon: '',
		value: {
			rolesRaw: 6
		}
	},
	{
		label: Constants.RoleType[7],
		icon: '',
		value: {
			rolesRaw: 7
		}
	},
	{
		label: 'RP - SuperNode',
		icon: '',
		value: {
			rolesRaw: null,
			rewardProgram: 'SuperNode'
		}
	},
	{
		label: 'RP - EarlyAdoption',
		icon: '',
		value: {
			rolesRaw: null,
			rewardProgram: 'EarlyAdoption'
		}
	},
	{
		label: 'RP - Ecosystem',
		icon: '',
		value: {
			rolesRaw: null,
			rewardProgram: 'Ecosystem'
		}
	}
];

export const payouts = [
	{
		label: 'rounds',
		value: 'rounds'
	},
	{
		label: 'voting',
		value: 'voting'
	}
];

export const accountTransactionReceipt = [
	{
		label: Constants.ReceiptTransactionStatamentType.BalanceChangeReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.balanceChange
		}
	},
	{
		label: Constants.ReceiptTransactionStatamentType.BalanceTransferReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.balanceTransfer
		}
	}
];

export const blockTransactionReceipt = [
	{
		label: Constants.ReceiptTransactionStatamentType.BalanceChangeReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.balanceChange
		}
	},
	{
		label: Constants.ReceiptTransactionStatamentType.BalanceTransferReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.balanceTransfer
		}
	},
	{
		label: Constants.ReceiptTransactionStatamentType.ArtifactExpiryReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.artifactExpiry
		}
	},
	{
		label: Constants.ReceiptTransactionStatamentType.InflationReceipt,
		icon: 'mdi-alert',
		value: {
			...customTransactionReceiptFilter.inflation
		}
	}
];
