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

import {
    TransactionType,
    AggregateTransaction,
    Account,
    Address,
    TransactionInfo,
    AggregateTransactionInfo,
    HashLockTransaction,
    NamespaceId,
    TransactionGroup,
    NetworkType,
    PublicAccount,
    Listener,
    Order,
    MosaicId,
    Mosaic,
    RepositoryFactoryHttp,
    MultisigAccountModificationTransaction,
    TransactionService,
    Deadline,
    UInt64
} from 'symbol-sdk';
import Constants from '../config/constants';
import http from './http';
import helper from '../helper';
import {
    BlockService,
    NamespaceService,
    MosaicService,
    LockService
} from '../infrastructure';
import { toArray } from 'rxjs/operators';

class AnnounceService {
    static announceHashLock = (signedHashLockTransaction, signedTransaction) => {
        return new Promise((resolve, reject) => {
            const nodeUrl = http.nodeUrl;
            const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
            //const listener = repositoryFactory.createListener()
            const receiptHttp = repositoryFactory.createReceiptRepository();
            const transactionHttp = repositoryFactory.createTransactionRepository();
            const customWsEndpoint = `${localStorage.getItem('currentNode') || globalConfig.peersApi.defaultNode |> helper.httpToWsUrl}/ws`;
            const listener = new Listener(customWsEndpoint, transactionHttp, WebSocket);
            const transactionService = new TransactionService(transactionHttp, receiptHttp);

            listener.open()
            .then(() => {
                transactionService
                    .announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener)
                    .subscribe(
                        (x) => {
                            console.log('AnnounceService', x);
                            listener.close();
                            resolve(x);
                        },
                        (err) => {
                            console.error('AnnounceService', err);
                            listener.close();
                            reject(err);
                        }
                    );
            });
        });
    }

    static getSignedHashLosck = (signedTransaction, account) => {
        const networkCurrencyMosaicId = new MosaicId(http.networkCurrency.mosaicId);

        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            new Mosaic(
                networkCurrencyMosaicId,
                UInt64.fromUint(10 * Math.pow(10, http.networkCurrency.divisibility))
            ),
            UInt64.fromUint(480),
            signedTransaction,
            http.networkType,
            UInt64.fromUint(2000000)
        );

        const signedHashLockTransaction = account.sign(hashLockTransaction, http.generationHash);
        return signedHashLockTransaction;
    }

    static multisigAccountModification = async (privateKey, cosignatoryPublicKeys) => {
        const transactionRepository = await http.createRepositoryFactory.createTransactionRepository();
        const networkType = http.networkType;
        const networkGenerationHash = http.generationHash;


        // Candidate multisig account
        const account = Account.createFromPrivateKey(privateKey, networkType);
        // Cosignatory accounts
        const cosignatoryAccountList = cosignatoryPublicKeys.map(publicKey => PublicAccount.createFromPublicKey(publicKey, networkType));
        const cosignatoryAddressList = cosignatoryAccountList.map(account => account.address);
        

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            1,
            1,
            cosignatoryAddressList,
            [],
            networkType
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [multisigAccountModificationTransaction.toAggregate(account.publicAccount)],
            networkType,
            [],
            UInt64.fromUint(2000000)
        );

        
        const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
        console.log(signedTransaction.hash);
        const signedHashLockTransaction = this.getSignedHashLosck(signedTransaction, account);
        this.announceHashLock(signedHashLockTransaction, signedTransaction);    
    }
}

export default AnnounceService;
