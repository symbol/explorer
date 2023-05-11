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

import http from './http';
import helper from '../helper';
import {
	Account,
	Address,
	AggregateTransaction,
	Deadline,
	HashLockTransaction,
	Listener,
	Mosaic,
	MosaicId,
	MultisigAccountModificationTransaction,
	PublicAccount,
	RepositoryFactoryHttp,
	TransactionService,
	UInt64
} from 'symbol-sdk';

class AnnounceService {
	static announceHashLock = (signedHashLockTransaction, signedTransaction) => {
		return new Promise((resolve, reject) => {
			const { nodeUrl } = http;
			const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
			// const listener = repositoryFactory.createListener()
			const receiptHttp = repositoryFactory.createReceiptRepository();
			const transactionHttp = repositoryFactory.createTransactionRepository();
			const customWsEndpoint = `${
				localStorage.getItem('currentNode') |> helper.httpToWsUrl
			}/ws`;
			const listener = new Listener(
				customWsEndpoint,
				transactionHttp,
				WebSocket
			);
			const transactionService = new TransactionService(
				transactionHttp,
				receiptHttp
			);

			listener.open().then(() => {
				transactionService
					.announceHashLockAggregateBonded(
						signedHashLockTransaction,
						signedTransaction,
						listener
					)
					.subscribe(
						x => {
							listener.close();
							resolve(x);
						},
						err => {
							console.error('AnnounceService', err);
							listener.close();
							reject(err);
						}
					);
			});
		});
	};

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

		const signedHashLockTransaction = account.sign(
			hashLockTransaction,
			http.generationHash
		);

		return signedHashLockTransaction;
	};

	static multisigAccountModification = async ({
		accountPrivateKey,
		minApprovalDelta = 1,
		minRemovalDelta = 1,
		additions = [],
		deletions = []
	}) => {
		// const transactionRepository = await http.createRepositoryFactory.createTransactionRepository();
		const { networkType } = http;
		const networkGenerationHash = http.generationHash;
		const account = Account.createFromPrivateKey(
			accountPrivateKey,
			networkType
		);

		const addressAdditions = additions.map(addition => {
			if ('string' === typeof addition && 64 === addition.length)
				return PublicAccount.createFromPublicKey(addition, networkType).address;
			if ('string' === typeof addition && 39 === addition.length)
				return Address.createFromRawAddress(addition);
			return addition;
		});

		const addressDeletions = deletions.map(delition => {
			if ('string' === typeof delition && 64 === delition.length)
				return PublicAccount.createFromPublicKey(delition, networkType).address;
			if ('string' === typeof delition && 39 === delition.length)
				return Address.createFromRawAddress(delition);
			return delition;
		});

		const multisigAccountModificationTransaction =
			MultisigAccountModificationTransaction.create(
				Deadline.create(),
				minApprovalDelta,
				minRemovalDelta,
				addressAdditions,
				addressDeletions,
				networkType
			);

		const aggregateTransaction = AggregateTransaction.createBonded(
			Deadline.create(),
			[
				multisigAccountModificationTransaction.toAggregate(account.publicAccount)
			],
			networkType,
			[],
			UInt64.fromUint(2000000)
		);

		const signedTransaction = account.sign(
			aggregateTransaction,
			networkGenerationHash
		);

		const signedHashLockTransaction = this.getSignedHashLosck(
			signedTransaction,
			account
		);

		this.announceHashLock(signedHashLockTransaction, signedTransaction);
	};
}

export default AnnounceService;
