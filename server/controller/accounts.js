const { AccountHttp, Address  } = require('nem2-sdk');
const utils = require('../utils');

const endpoint = utils.getNodeEndPoint();

const accountHttp = new AccountHttp(endpoint);

async function getAccountInfoByAddress(address) {

   const accountInfo = await accountHttp.getAccountInfo(new Address(address)).toPromise()

   return await utils.formatAccount(accountInfo)
}

async function getAccountTransactionsByAddress(address) {

    const accountInfo = await getAccountInfoByAddress(address);

    const transactionsList = await accountHttp.transactions(accountInfo).toPromise();

    return await utils.formatTxs(transactionsList);
}

module.exports = {
    getAccountInfoByAddress,
    getAccountTransactionsByAddress,
}