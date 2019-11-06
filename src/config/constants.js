import {
  TransactionType,
  MosaicSupplyChangeAction,
  NamespaceRegistrationType,
  AliasAction,
  LinkAction,
  AccountType,
  HashType
} from 'nem2-sdk'

class Constants {
  static PageSize = 25

  static Message = {
    UNLIMITED: 'UNLIMITED',
    UNAVAILABLE: 'N/A',
    INFINITY: 'INFINITY',
    MOSAIC: 'MOSAIC',
    ADDRESS: 'ADDRESS',
    NO_ALIAS: 'NO ALIAS'
  }

  static NetworkConfig = {
    MOSAIC_RENTAL_FEE_SINK_ADDRESS : 'SDKDPA36TE53BO24FD4KA6OPGOUSEVOU3O5SIFMY',
    NAMESPACE_RENTAL_FEE_SINK_ADDRESS: 'SDTZ23JBJZP3GTKKM2P6FYCMXS6RQYPB6R477TTR'
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
}

export default Constants
