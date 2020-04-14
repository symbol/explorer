import http from './http'
import { Address, AccountRestrictionFlags } from 'symbol-sdk'
import helper from '../helper'
import Constants from '../config/constants'

class RestrictionService {
  /**
   * Get Account Restriction from symbol SDK
   * @param address - Account address to be created from PublicKey or RawAddress
   * @returns AccountRestrictions[]
   */
  static getAccountRestrictions = async address => {
    let accountRestrictions
    try {
      accountRestrictions = await http.restrictionAccount.getAccountRestrictions(Address.createFromRawAddress(address)).toPromise()
    } catch (e) {
      // To Catach statusCode 404 if Account Restrictions is no available
      throw Error('Account Restrictions is no available.')
    }

    const formattedAccountRestrictions = accountRestrictions.map(accountRestriction => this.formatAccountRestriction(accountRestriction))
    return formattedAccountRestrictions
  }

  /**
   * Get Mosaic Global Restriction from symbol SDK
   * @param mosaicId - - Mosaic identifier
   * @returns MosaicGlobalRestriction
   */
  static getMosaicGlobalRestriction = async mosaicId => {
    let mosaicGlobalRestrictions

    try {
      mosaicGlobalRestrictions = await http.restrictionMosaic.getMosaicGlobalRestriction(mosaicId).toPromise()
    } catch (e) {
      // To Catach statusCode 404 if Mosaic Global Restrictions is no available
      throw Error('Mosaic Global Restrictions is no available.')
    }

    return this.formatMosaicGlobalRestrictions(mosaicGlobalRestrictions)
  }

  /**
   * Format AccountRestriction to readable object
   * @param AccountRestrictionDTO
   * @returns Object readable AccountRestriction object
   */
  static formatAccountRestriction = accountRestriction => {
    switch (accountRestriction.restrictionFlags) {
    case AccountRestrictionFlags.AllowIncomingAddress:
    case AccountRestrictionFlags.BlockIncomingAddress:
    case AccountRestrictionFlags.AllowOutgoingAddress:
    case AccountRestrictionFlags.BlockOutgoingAddress:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionAddressValues: accountRestriction.values.map(value => value.address)
      }
    case AccountRestrictionFlags.AllowMosaic:
    case AccountRestrictionFlags.BlockMosaic:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionMosaicValues: accountRestriction.values.map(value => value.id.toHex())
      }
    case AccountRestrictionFlags.AllowIncomingTransactionType:
    case AccountRestrictionFlags.AllowOutgoingTransactionType:
    case AccountRestrictionFlags.BlockIncomingTransactionType:
    case AccountRestrictionFlags.BlockOutgoingTransactionType:
      return {
        restrictionType: Constants.AccountRestrictionFlags[accountRestriction.restrictionFlags],
        restrictionTransactionValues: accountRestriction.values.map(value => Constants.TransactionType[value])
      }
    }
  }

  /**
   * Format MosaicGlobalRestrictions to readable object
   * @param MosaicGlobalRestrictionDTO
   * @returns Object readable MosaicGlobalRestrictions object
   */
  static formatMosaicGlobalRestrictions = mosaicRestriction => {
    let mosaicGlobalRestrictionItem = []

    // Convert Map<k,v> to Array
    mosaicRestriction.restrictions.forEach((value, key) => {
      mosaicGlobalRestrictionItem.push({ key, ...value })
      return mosaicGlobalRestrictionItem
    })

    return {
      ...mosaicRestriction,
      entryType: Constants.MosaicRestrictionEntryType[mosaicRestriction.entryType],
      mosaicId: mosaicRestriction.mosaicId.toHex(),
      restrictions: mosaicGlobalRestrictionItem.map(item => ({
        restrictionKey: item.key,
        restrictionType: Constants.MosaicRestrictionType[item.restrictionType],
        restrictionValue: item.restrictionValue,
        referenceMosaicId: item.referenceMosaicId.toHex() === '0000000000000000' ? mosaicRestriction.mosaicId.toHex() : item.referenceMosaicId.toHex()
      }))
    }
  }

  /**
   * Format Account Restriction list dataset into Vue component
   * @param address - Address in string format.
   * @returns Account Restriction list
   */
  static getAccountRestrictionList = async (address) => {
    const accountRestrictions = await this.getAccountRestrictions(address)
    return accountRestrictions
  }

  /**
   * Format Mosaic Global Restriction info dataset into Vue component
   * @param hexOrNamespace - hex value or namespace name
   * @returns Mosaic Global Restriction info
   */
  static getMosaicGlobalRestrictionInfo = async (hexOrNamespace) => {
    const mosaicId = await helper.hexOrNamespaceToId(hexOrNamespace, 'mosaic')
    const mosaicGlobalRestrictionMetadata = await this.getMosaicGlobalRestriction(mosaicId)

    return mosaicGlobalRestrictionMetadata
  }
}

export default RestrictionService
