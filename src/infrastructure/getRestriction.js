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

import http from './http'
import { Address, MosaicId, NamespaceId } from 'nem2-sdk'
import format from '../format'
import helper from '../helper'

export const getAccountRestrictions = async address => {
  const addressObj = Address.createFromRawAddress(address)
  let accountRestrictions

  try {
    accountRestrictions = await http.restrictionAccount.getAccountRestrictions(addressObj).toPromise()
  } catch (e) {
    // To Catach statusCode 404 if Account Restrictions is no available
    throw Error('Account Restrictions is no available.')
  }

  return format.formatAccountRestrictions(accountRestrictions)
}

export const getMosaicRestrictions = async mosaicHexOrNamespace => {
  let mosaicID
  let mosaicGlobalRestrictions

  if (helper.isHexadecimal(mosaicHexOrNamespace))
    mosaicID = new MosaicId(mosaicHexOrNamespace)
  else {
    let namespaceId = new NamespaceId(mosaicHexOrNamespace)
    mosaicID = await http.namespace.getLinkedMosaicId(namespaceId).toPromise()
  }

  try {
    mosaicGlobalRestrictions = await http.restrictionMosaic.getMosaicGlobalRestriction(mosaicID).toPromise()
  } catch (e) {
    // To Catach statusCode 404 if Mosaic Global Restrictions is no available
    throw Error('Mosaic Global Restrictions is no available.')
  }

  return format.formatMosaicRestriction(mosaicGlobalRestrictions)
}
