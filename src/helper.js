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

import { Constants } from './config';
import { NetworkType, MosaicId, NamespaceId, Address } from 'symbol-sdk';
import { NamespaceService } from './infrastructure';
import http from './infrastructure/http';
import moment from 'moment';

const Url = require('url-parse');

const getNetworkTypeAddressFormat = {
	[NetworkType.MAIN_NET]: 'nN',
	[NetworkType.MIJIN]: 'mM',
	[NetworkType.MIJIN_TEST]: 'sS',
	[NetworkType.TEST_NET]: 'tT'
};

class helper {
	static timeSince(interval) {
		if (interval.years > 1)
			return interval.years + ' years';
		else if (interval.years === 1)
			return interval.years + ' year';
		else if (interval.days > 1)
			return interval.days + ' days';
		else if (interval.days === 1)
			return interval.days + ' day';
		else if (interval.hours > 1)
			return interval.hours + ' hours';
		else if (interval.hours === 1)
			return interval.hours + ' hour';
		else if (interval.minutes > 1)
			return interval.minutes + ' min.';// ' minutes'
		else if (interval.minutes === 1)
			return interval.minutes + ' min.';// ' minute'
		else if (interval.seconds !== 1)
			return interval.seconds + ' sec.';// ' seconds'
		else
			return interval.seconds + ' sec.';// ' second'
	}

  static formatSeconds = second => {
  	if (!second && second !== 0) return '';
  	let d = 0;

  	let h = 0;

  	let m = 0;

  	if (second > 86400) {
  		d = Math.floor(second / 86400);
  		second = second % 86400;
  	}
  	if (second > 3600) {
  		h = Math.floor(second / 3600);
  		second = second % 3600;
  	}
  	if (second > 60) {
  		m = Math.floor(second / 60);
  		second = second % 60;
  	}
  	let result = '';

  	if (m > 0 || h > 0 || d > 0)
  		result = `${m} m ${result}`;

  	if (h > 0 || d > 0)
  		result = `${h} h ${result}`;

  	if (d > 0)
  		result = `${d} d ${result}`;

  	return result;
  }

  static isHexadecimal(str) {
  	return /^[0-9a-fA-F]+$/.test(str);
  }

  static isMosaicOrNamespaceId = (str) =>
  	str.length === 16

  static isTransactionId = (str) =>
  	str.length === 24

  static isAccountPublicKey = (str) =>
  	str.length === 64 &&
    str.match('^[A-z0-9]+$')

  static isAccountAddress = (str) =>
  	str.length === 39 &&
    str.match(`[${getNetworkTypeAddressFormat[http.networkType]}]{1,1}[a-zA-Z0-9]{5,5}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{6,6}[a-zA-Z0-9]{3,3}`)

  static isBlockHeight = (str) =>
  	str.match(/^-{0,1}\d+$/)

  static validURL(url) {
  	// All we expect is there is a valid origin for the url, IE,
  	// the origin is not 'null'.
  	return url.origin !== 'null';
  }

  static parseUrl(str) {
  	let url = new Url(str);

  	if (this.validURL(url))
  		return url;
  }

  static httpToWsUrl(str) {
  	let url = new Url(str);

  	if (this.validURL(url)) {
  		url.set('protocol', 'ws:');
  		return url;
  	}
  }

  static async logError(dispatch, action, ...args) {
  	try {
  		await dispatch(action, ...args);
  	}
  	catch (e) {
  		console.error(`Failed to call ${action}`, e);
  	}
  }

  static convertToSecond = durationInBlocks => durationInBlocks * http.networkConfig.TargetBlockTime

  static calculateNamespaceExpiration = (currentHeight, endHeight) => {
  	const expired = currentHeight > endHeight - http.networkConfig.NamespaceGraceDuration;
  	const expiredInBlock = endHeight - http.networkConfig.NamespaceGraceDuration - currentHeight;

  	return {
  		isExpired: expired,
  		expiredInBlock: expiredInBlock,
  		expiredInSecond: this.convertToSecond(expiredInBlock)
  	};
  }

  static fetchData = async (fetchFunction, commit, before, error, success) => {
  	if (typeof before === 'function')
  		await before();
  	else {
  		commit('setLoading', true);
  		commit('setError', false);
  	}
  	try {
  		await fetchFunction();
  	}
  	catch (e) {
  		if (typeof error === 'function')
  			await error(e);
  		else {
  			console.error(e);
  			commit('setError', true);
  		}
  	}
  	if (typeof success === 'function')
  		await success();
  	else
  		commit('setLoading', false);
  }

  /**
   * Convert hex value or namespace name to mosaicId or namespaceId
   * @param hexOrNamespace - hex value or namespace name
   * @param toId - 'mosaic' | 'namespace'
   * @returns MosaicId | NamespaceId
   */
  static hexOrNamespaceToId = async (hexOrNamespace, toId) => {
  	let Id = MosaicId | NamespaceId;

  	let isHexadecimal = this.isHexadecimal(hexOrNamespace);

  	if (isHexadecimal)
  		Id = toId === 'mosaic' ? new MosaicId(hexOrNamespace) : NamespaceId.createFromEncoded(hexOrNamespace);
  	else
  		Id = toId === 'mosaic' ? await http.namespace.getLinkedMosaicId(new NamespaceId(hexOrNamespace)).toPromise() : new NamespaceId(hexOrNamespace);

  	return Id;
  }

  /**
   * Decode Account Public key or Namespace name to plan Address.
   * @param address - Account publicKey string | naemspace name
   * @returns Plan Address - example : SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3
   */
  static decodeToAddress = async (address) => {
  	if (this.isAccountPublicKey(address))
  		return Address.createFromPublicKey(address, http.networkType).plain();

  	if (!this.isAccountAddress(address)) {
  		const namespaceId = new NamespaceId(address);

  		address = await NamespaceService.getLinkedAddress(namespaceId);
  		return address;
  	}

  	return address;
  }

  /**
   * Convert Mosaic amount to relative Amount with divisibility.
   * @param amount - number
   * @param divisibility - decimal
   * @returns relativeAmount in string
   */
  static formatMosaicAmountWithDivisibility = (amount, divisibility) => {
  	let relativeAmount = divisibility !== 0 ? amount / Math.pow(10, divisibility) : amount.compact();

  	return relativeAmount.toLocaleString('en-US', { minimumFractionDigits: divisibility });
  }

  /**
   * Get network currency balance.
   * @param mosaics - array of formatted mosaic[]
   * @returns balance - formatted mosaic amount
   */
  static getNetworkCurrencyBalance = mosaics => {
  	let mosaic = mosaics.find(mosaic => mosaic.id.toHex() === http.networkCurrecy.mosaicId);

  	let balance = mosaic !== undefined ? this.toNetworkCurrency(mosaic.amount) : Constants.Message.UNAVAILABLE;

  	return balance;
  }

  /**
   * Get last Activity height.
   * @param activityBucket - array of activityBucket
   * @returns la
   */
  static getLastActivityHeight = activityBucket => {
  	let activityBucketLength = activityBucket.length;

  	let lastActivityHeight = activityBucketLength > 0 ? activityBucket[activityBucketLength - 1].startHeight : Constants.Message.UNAVAILABLE;

  	return lastActivityHeight;
  }

  /**
   * Convert networkTimestamp to UTC date
   * @param networkTimestamp
   * @returns UTC date with format YYYY-MM-DD HH:mm:ss
   */
  static convertToUTCDate = networkTimestamp => moment.utc(networkTimestamp * 1000).local()
  	.format('YYYY-MM-DD HH:mm:ss')

  /**
   * convert difficulty raw score to readable
   * @param difficulty - raw difficulty score
   * @returns difficulty - readable difficulty score
   */
  static convertBlockDifficultyToReadable = difficulty => (difficulty.compact() / 1000000000000).toFixed(2).toString()

  /**
   * Format Importance score to percentage
   * @param {number} rawScore
   * @returns {string}
   */
  static ImportanceScoreToPercent = rawScore => {
  	const totalchainimportance = http.networkConfig.TotalChainImportance;
  	const divisibility = http.networkCurrecy.divisibility;

  	let percent = rawScore;

  	if (rawScore > 0)
  		percent = rawScore / totalchainimportance;

  	return (percent * 100).toFixed(divisibility).toString() + ' %';
  }

  /**
   * Format number to Network currecy divisibility.
   * example transaction fees
   * @param amount - number
   * @returns amount - (string) with formatted divisibility
   */
  static toNetworkCurrency = amount => (amount / Math.pow(10, http.networkCurrecy.divisibility)).toLocaleString('en-US', { minimumFractionDigits: http.networkCurrecy.divisibility })

  /**
   * Convert public key to Address.
   * @param publicKey - raw public key
   * @returns address - address in plain format
   */
  static publicKeyToAddress = publicKey => Address.createFromPublicKey(publicKey, http.networkType).plain()

  /**
   * convet network timestamp to world time
   * @param timestamp - raw timestamp
   * @returns timestamp - world timestamp
   */
  static networkTimestamp = timestamp => Math.round(timestamp / 1000) + http.networkConfig.NemsisTimestamp

  /**
   * Sort Native mosaic to top of list
   * @param mosaics - array of mosaic
   * @returns mosaic[] - sort array of mosaic
   */
  static sortMosaics = mosaics => {
  	let sortedMosaics = [];

  	mosaics.forEach(mosaic =>
  		mosaic.mosaicId === http.networkCurrecy.mosaicId
  			? sortedMosaics.unshift(mosaic)
  			: sortedMosaics.push(mosaic)
  	);

  	return sortedMosaics;
  }

  /**
   * Convert second to time from now in second
   * @param second
   * @returns time from now in second
   */
  static convertTimeFromNowInSec = second => moment.utc().add(second, 's')
  	.fromNow()

  /**
   * convert second to Date
   * @param second
   * @returns YYYY-MM-DD HH:mm:ss
   */
  static convertSecondToDate = second => moment.utc().add(second, 's')
  	.local()
  	.format('YYYY-MM-DD HH:mm:ss')

  /**
   * Convert block deadline to date
   * @param deadlineValue - deadline from block
   * @returns YYYY-MM-DD HH:mm:ss
   */
  static convertDeadlinetoDate = deadline => moment.utc(new Date(deadline)).local()
  	.format('YYYY-MM-DD HH:mm:ss')

  /**
   * Get RGB color from hash
   * @param hash - hash to be converted
   * @returns object { R: Number, G: Number, B: Number }
   */
    static getColorFromHash = (hash, isHex = true) => {
    	const color = {
    		R: 0,
    		G: 0,
    		B: 0
    	};

    	if (typeof hash !== 'string') {
    		console.error('Failed to convert hash to color. Hash is not a String');
    		return color;
    	}
    	if (hash.length < 3) {
    		console.error('Failed to convert hash to color. Hash string length < 3');
    		return color;
    	}

    	const hexToRGB = (hexString) => {
    		let totalHex = 0;

    		for (const hex of hexString)
    			totalHex += parseInt(hex, 16);

    		return Math.trunc(totalHex * 255 / (15 * hexString.length));
    	};

    	const charsetToRGB = (string) => {
    		const charset = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    		let totalHex = 0;

    		for (const char of string)
    			totalHex += charset.indexOf(char.toLowerCase());

    		return Math.trunc(totalHex * 255 / ((charset.length - 1) * string.length));
    	};

    	const hashLength = hash.length;
    	const colorStrLength = Math.trunc(hashLength / 3);

    	const strRed = hash.substring(0, colorStrLength);
    	const strGreen = hash.substring(colorStrLength, colorStrLength * 2);
    	const strBlue = hash.substring(colorStrLength * 2, colorStrLength * 3);

    	color.R = isHex ? hexToRGB(strRed) : charsetToRGB(strRed.substring(2, 3));
    	color.G = isHex ? hexToRGB(strGreen) : charsetToRGB(strGreen);
    	color.B = isHex ? hexToRGB(strBlue) : charsetToRGB(strBlue);

    	return color;
    }

    static truncString(str, strLen = 4) {
    	if (typeof str === 'string') {
    		if (str.length > strLen * 2)
    			return `${str.substring(0, strLen)}...${str.substring(str.length - strLen, str.length)}`;
    		return str;
    	}
    	console.error('Failed to trunc string. Provided value is not a string');
    	return str;
    }
}

export default helper;
