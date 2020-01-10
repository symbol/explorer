import {
  TransactionType,
  MosaicSupplyChangeAction,
  NamespaceRegistrationType,
  AliasAction,
  LinkAction,
  AccountType,
  HashType,
  NetworkType,
  MetadataType,
  ReceiptType,
  ResolutionType
} from 'nem2-sdk'

class Constants {
  static PageSize = 25

  static Message = {
    UNLIMITED: 'UNLIMITED',
    UNAVAILABLE: 'N/A',
    INFINITY: 'INFINITY',
    MOSAIC: 'MOSAIC',
    ADDRESS: 'ADDRESS',
    NO_ALIAS: 'NO ALIAS',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  }

  static NetworkConfig = {
    MOSAIC_RENTAL_FEE_SINK_ADDRESS: 'TB65QSXGV5FUTRPVMSCVB4RZ7FJLU32LHOOP4MDI',
    NAMESPACE_RENTAL_FEE_SINK_ADDRESS: 'TB65QSXGV5FUTRPVMSCVB4RZ7FJLU32LHOOP4MDI',
    NAMESPACE: ['NEM', 'NEM.XEM'],
    NATIVE_MOSAIC_HEX: '75AF035421401EF0',
    NATIVE_MOSAIC_DIVISIBILITY: 6,
    NETWORKTYPE: NetworkType.TEST_NET,
    NEMESIS_TIMESTAMP: 1573430400
  }

  static TransactionType = {
    [TransactionType.TRANSFER]: 'Transfer',
    [TransactionType.REGISTER_NAMESPACE]: 'Register Namespace',
    [TransactionType.ADDRESS_ALIAS]: 'Address Alias',
    [TransactionType.MOSAIC_ALIAS]: 'Mosaic Alias',
    [TransactionType.MOSAIC_DEFINITION]: 'Mosaic Definition',
    [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'Mosaic Supply Change',
    [TransactionType.MODIFY_MULTISIG_ACCOUNT]: 'Modify Multisig Account',
    [TransactionType.AGGREGATE_COMPLETE]: 'Aggregate Complete',
    [TransactionType.AGGREGATE_BONDED]: 'Aggregate Bonded',
    [TransactionType.LOCK]: 'Lock',
    [TransactionType.SECRET_LOCK]: 'Secret Lock',
    [TransactionType.SECRET_PROOF]: 'Secret Proof',
    [TransactionType.ACCOUNT_RESTRICTION_ADDRESS]: 'Account Restriction Address',
    [TransactionType.ACCOUNT_RESTRICTION_MOSAIC]: 'Account Restriction Mosaic',
    [TransactionType.ACCOUNT_RESTRICTION_OPERATION]: 'Account Restriction Operation',
    [TransactionType.LINK_ACCOUNT]: 'Link Account',
    [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: 'Mosaic Address Restriction',
    [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: 'Mosaic Global Restriction',
    [TransactionType.ACCOUNT_METADATA_TRANSACTION]: 'Account Metadata Transaction',
    [TransactionType.MOSAIC_METADATA_TRANSACTION]: 'Mosaic Metadata Transaction',
    [TransactionType.NAMESPACE_METADATA_TRANSACTION]: 'Namespace Metadata Transaction'
  }

  static MosaicSupplyChangeAction = {
    [MosaicSupplyChangeAction.Increase]: 'Increase',
    [MosaicSupplyChangeAction.Decrease]: 'Decrease'
  }

  static NamespaceRegistrationType = {
    [NamespaceRegistrationType.RootNamespace]: 'Root Namespace',
    [NamespaceRegistrationType.SubNamespace]: 'Sub Namespace'
  }

  static AliasAction = {
    [AliasAction.Link]: 'Link',
    [AliasAction.Unlink]: 'Unlink'
  }

  static LinkAction = {
    [LinkAction.Link]: 'Link',
    [LinkAction.Unlink]: 'Unlink'
  }

  static AccountType = {
    [AccountType.Unlinked]: 'Unlinked',
    [AccountType.Main]: 'Main',
    [AccountType.Remote]: 'Remote',
    [AccountType.Remote_Unlinked]: 'Remote Unlinked'
  }

  static HashType = {
    [HashType.Op_Sha3_256]: 'Op_Sha3_256',
    [HashType.Op_Keccak_256]: 'Op_Keccak_256',
    [HashType.Op_Hash_160]: 'Op_Hash_160',
    [HashType.Op_Hash_256]: 'Op_Hash_256'
  }

  static MetadataType = {
    [MetadataType.Account]: 'Account',
    [MetadataType.Mosaic]: 'Mosaic',
    [MetadataType.Namespace]: 'Namespace'
  }

  static ReceiptType = {
    [ReceiptType.Harvest_Fee]: 'Harvest Fee',
    [ReceiptType.LockHash_Created]: 'LockHash Created',
    [ReceiptType.LockHash_Completed]: 'LockHash Completed',
    [ReceiptType.LockHash_Expired]: 'LockHash Expired',
    [ReceiptType.LockSecret_Created]: 'LockSecret Created',
    [ReceiptType.LockSecret_Completed]: 'LockSecret Completed',
    [ReceiptType.LockSecret_Expired]: 'LockSecret Expired',
    [ReceiptType.Mosaic_Levy]: 'Mosaic Levy',
    [ReceiptType.Mosaic_Rental_Fee]: 'Mosaic Rental Fee',
    [ReceiptType.Namespace_Rental_Fee]: 'Namespace Rental Fee',
    [ReceiptType.Mosaic_Expired]: 'Mosaic Expired',
    [ReceiptType.Namespace_Expired]: 'Namespace Expired',
    [ReceiptType.Namespace_Deleted]: 'Namespace Deleted',
    [ReceiptType.Inflation]: 'Inflation',
  }

  static ResolutionType = {
    [ResolutionType.Address]: 'Address',
    [ResolutionType.Mosaic]: 'Mosaic'
  }
}

export default Constants
