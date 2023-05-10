import {
	Account,
	Crypto,
	Mosaic,
	MosaicId,
	NamespaceId,
	NetworkType,
	SHA3Hasher,
	TransactionInfo,
	TransactionType,
	UInt64
} from 'symbol-sdk';

const generateRandomHash = (length = 32) => {
	const seed = Crypto.randomBytes(32);
	return SHA3Hasher.getHasher(length)
		.create()
		.update(seed)
		.hex()
		.toUpperCase();
};

const transactionCommonField = {
	deadline: {
		adjustedValue: 8266897456
	},
	maxFee: UInt64.fromUint(1000000),
	networkType: NetworkType.TEST_NET,
	payloadSize: 176,
	signature: generateRandomHash(64),
	signer: {
		address: Account.generateNewAccount(NetworkType.TEST_NET).address
	},
	version: 1,
	transactionInfo: {
		index: 1,
		id: 1,
		height: 198327,
		timestamp: 1646063763,
		feeMultiplier: 10,
		hash: generateRandomHash()
	}
};

const receiptCommonField = {
	amount: UInt64.fromUint(10000000),
	height: UInt64.fromUint(1000),
	mosaicId: new MosaicId('6BED913FA20223F8'),
	version: 1
};

const TestHelper = {
	/**
     * Mock Account info.
     * @param {Account} account Account.
     * @returns {object} account info.
     */
	mockAccountInfo: account => {
		return {
			version: 1,
			address: account.address.plain(),
			addressHeight: 1,
			publicKey: account.publicKey,
			publicKeyHeight: 1,
			accountType: 'Remote',
			activityBucket: [],
			mosaics: [],
			importance: '0.000000 %',
			importanceHeight: 0,
			supplementalPublicKeys: {
				linked: Account.generateNewAccount(NetworkType.TEST_NET).publicKey,
				node: 'N/A',
				vrf: 'N/A',
				voting: [{
					publicKey: Account.generateNewAccount(NetworkType.TEST_NET).publicKey,
					startEpoch: 1,
					endEpoch:200
				},
				{
					publicKey: Account.generateNewAccount(NetworkType.TEST_NET).publicKey,
					startEpoch: 201,
					endEpoch:400
				},
				{
					publicKey: Account.generateNewAccount(NetworkType.TEST_NET).publicKey,
					startEpoch: 401,
					endEpoch:600
				}]
			}
		};
	},
	/**
     * Random generate testnet account.
     * @param {number} numberOfAccount number of account.
     * @returns {Account[]} Accounts
     */
	generateAccount: numberOfAccount => {
		return [...Array(numberOfAccount).keys()].map(() => Account.generateNewAccount(NetworkType.TEST_NET));
	},
	/**
     * Mock Block Info.
     * @param {number} blockHeight block height.
     * @param {string} blockSigner signer of the block.
     * @param {boolean} isImportantBlock flag to generate important block.
     * @returns {object} block info.
     */
	mockBlockInfo: (blockHeight, blockSigner, isImportantBlock = false) => {
		const importantBlock = isImportantBlock ? {
			totalVotingBalance: '1000000',
			harvestingEligibleAccountsCount: 1
		} : {};

		const epochAdjustment = 1637848847;

		return {
			...importantBlock,
			beneficiaryAddress: 'TB6AAIGRL4EAN5ZXMQ74AJPURPFK7ALD6DGEWZA',
			blockReceiptsHash: 'D5260B042395A10ED0312538CEDF189242C31908E0F54F23827DD434F7310F2A',
			blockTransactionsHash: '728DC509997C6A6A3C4A388326B1D49C525345915C14B4B7120E7864B7F88B01',
			blockType: isImportantBlock ? 'Importance Block' : 'Normal Block',
			difficulty: '108.45',
			feeMultiplier: '100',
			generationHash: 'FFF1E7A8491C05AEB6B116D6EABFD1ABBF5B7D543AA1A52BA9EC783DCF99D4D4',
			hash: '45C3B9797EA67293E186B24262B1875D862B0E7CC25A56C74CEFBC4BC4EAF11F',
			height: blockHeight,
			networkType: NetworkType.TEST_NET,
			previousBlockHash: generateRandomHash(64),
			proofGamma: generateRandomHash(64),
			proofScalar: generateRandomHash(64),
			proofVerificationHash: 'E810C0DFD0537C6DEFF1EA8C7CD42E7D',
			signature: generateRandomHash(64),
			signer: blockSigner,
			size: 13112,
			stateHash: generateRandomHash(),
			stateHashSubCacheMerkleRoots: [...Array(9).keys()].map(() => generateRandomHash()),
			statements: 1,
			statementsCount: 1,
			timestamp: epochAdjustment + blockHeight,
			timestampRaw: 527879569,
			totalFee: '1.000000',
			totalTransactions: 10,
			totalTransactionsCount: 10,
			transactions: 1,
			transactionsCount: 1,
			type: isImportantBlock ? 33347 : 33091,
			version: 1
		};
	},
	/**
	 * Mock Block Info.
	 * @param {string} mosaicId mosaic id hex.
	 * @param {string} address account address.
	 * @param {number} startHeight start height.
	 * @param {number} duration duration.
	 * @returns {object} mosaic info
	 */
	mockMosaicInfo: (mosaicId, address, startHeight, duration) => {
		return {
			mosaicId: mosaicId,
			divisibility: 0,
			address,
			supply: '10',
			relativeAmount: '10',
			revision: 1,
			startHeight,
			duration,
			supplyMutable: false,
			transferable: true,
			restrictable: false,
			revokable: false
		};
	},
	/**
	 * Mock mosaic alias.
	 * @param {string} mosaicId mosaic id hex.
	 * @param {string} name alias name for mosaic.
	 * @returns {object} mosaic alias.
	 */
	mockMosaicName: (mosaicId, name) => {
		return {
			mosaicId,
			names: [{
				name
			}]
		};
	},
	/**
	 * Mock Namespace.
	 * @param {string} namespaceName namespace name, it support root or sub namespace.
	 * @param {number} duration duration to expired.
	 * @returns {object} namespace.
	 */
	mockNamespace: (namespaceName, duration) => {
		let namespaceProps = {};
		let namespaceLength = namespaceName.split('.').length;

		if (2 === namespaceLength ) {
			Object.assign(namespaceProps, {
				registrationType: 'subNamespace',
				parentName: namespaceName.split('.')[0],
				parentId: new NamespaceId(namespaceName.split('.')[0]),
				levels: [
					new NamespaceId(namespaceName.split('.')[0]),
					new NamespaceId(namespaceName.split('.')[1])
				]
			});
		} else if (1 === namespaceLength) {
			Object.assign(namespaceProps, {
				registrationType: 'rootNamespace',
				parentName: '',
				parentId: new NamespaceId([0, 0]),
				levels: [
					new NamespaceId(namespaceName.split('.')[0])
				]
			});
		}

		return {
			active: 'ACTIVE',
			alias: undefined,
			aliasType: 'N/A',
			depth: 1,
			endHeight: 0 === duration ? 'INFINITY' : 86400 + duration,
			index: 0,
			mosaicId: undefined,
			name: namespaceName,
			namespaceId: new NamespaceId(namespaceName).toHex(),
			namespaceName,
			ownerAddress: Account.generateNewAccount(NetworkType.TEST_NET).address.plain(),
			startHeight: 1,
			type: 0,
			version: 1,
			...namespaceProps
		};
	},
	/**
	 * Mock transfer transaction.
	 * @param {number} blockHeight block height.
	 * @returns {object} transaction.
	 */
	mockTransaction: ({height, timestamp}) => {
		return {
			...transactionCommonField,
			type: TransactionType.TRANSFER,
			transactionInfo: new TransactionInfo(height, 1, 1, timestamp, 10, generateRandomHash()),
			recipientAddress: {
				address: Account.generateNewAccount(NetworkType.TEST_NET).address
			},
			mosaics: [
				new Mosaic(new MosaicId('7F2D26E89342D398'), UInt64.fromUint(5))
			]
		};
	},
	/**
	 * Mock inflation statement.
	 * @param {number} amount reward amount.
	 * @param {number} height block height.
	 * @returns {object} inflation statement.
	 */
	mockInflationStatement: (amount, height) => {
		return {
			amount: UInt64.fromUint(amount),
			height: UInt64.fromUint(height),
			mosaicId: new MosaicId('6BED913FA20223F8'),
			type: 20803,
			version: 1
		};
	},
	mockMosaicSupplyRevocationTransaction: mosaic => {
		return {
			...transactionCommonField,
			mosaic,
			sourceAddress: Account.generateNewAccount(NetworkType.TEST_NET).address,
			type: TransactionType.MOSAIC_SUPPLY_REVOCATION,
			version: 1
		};
	},
	mockSecretLockTransaction: mosaic => {
		return {
			...transactionCommonField,
			mosaic,
			hashAlgorithm: 0,
			duration: UInt64.fromUint(10),
			type: TransactionType.SECRET_LOCK,
			recipientAddress: {
				address: Account.generateNewAccount(NetworkType.TEST_NET).address
			},
			secret: 'FFF86D517ACFBCD86229CBDCECF9E7F777EF0B5FB54B15D794C68C33942A09D8'
		};
	},
	mockLockFundsTransaction: () => {
		return {
			...transactionCommonField,
			duration: UInt64.fromUint(10),
			hash: '5547B43ECBCA8C90114BBD2C741D609719A0C61C7B03049125521ECE2415E376',
			mosaic: new Mosaic(new MosaicId('6BED913FA20223F8'), UInt64.fromUint(10)),
			type: TransactionType.HASH_LOCK
		};
	},
	createFormattedHashLockTransaction: status => {
		return {
			amount: UInt64.fromUint(10000000),
			endHeight: 10,
			hash: generateRandomHash(64),
			mosaicId: new MosaicId('6BED913FA20223F8'),
			ownerAddress: Account.generateNewAccount(NetworkType.TEST_NET).address.plain(),
			recordId: '631FA269464297FBEBEFE0ED',
			status,
			version: 1
		};
	},
	createFormattedSecretLockTransaction: (mosaicIdHex, amount, status) => {
		return {
			amount: UInt64.fromUint(amount),
			compositeHash: generateRandomHash(64),
			hashAlgorithm: 'Sha3 256',
			endHeight: 10,
			mosaicId: new MosaicId(mosaicIdHex),
			ownerAddress: Account.generateNewAccount(NetworkType.TEST_NET).address.plain(),
			recipient: Account.generateNewAccount(NetworkType.TEST_NET).address.plain(),
			recordId: '631FA269464297FBEBEFE0ED',
			secret: '112233445566',
			status,
			version: 1
		};

	},
	mockBalanceChangeReceipt: (amount, mosaicIdHex, type) => {
		return {
			...receiptCommonField,
			amount: UInt64.fromUint(amount),
			mosaicId: new MosaicId(mosaicIdHex),
			targetAddress: Account.generateNewAccount(NetworkType.TEST_NET).address,
			type
		};
	},
	mockBalanceTransferReceipt: (amount, type) => {
		return {
			...receiptCommonField,
			amount: UInt64.fromUint(amount),
			recipientAddress: Account.generateNewAccount(NetworkType.TEST_NET).address,
			senderAddress: Account.generateNewAccount(NetworkType.TEST_NET).address,
			type
		};
	},
	mockInflationReceipt: () => {
		return {
			...receiptCommonField,
			type: 20803
		};
	},
	mockArtifactExpiryReceipt: (artifactId, type) => {
		return {
			artifactId,
			height: UInt64.fromUint(1000),
			version: 1,
			type
		};
	},
	createPartialAggregateTransaction: (cosignatures = [], innerTransactions = []) => {
		return {
			...transactionCommonField,
			type: TransactionType.AGGREGATE_BONDED,
			cosignatures,
			innerTransactions
		};
	},
	generateNodePeerStatus: isAvailable => {
		return {
			isAvailable,
			lastStatusCheck: 1676809816662
		};
	},
	generateNodeApiStatus: isAvailable => {
		return {
			isAvailable,
			nodePublicKey: '4DA6FB57FA168EEBBCB68DA4DDC8DA7BCF41EC93FB22A33DF510DB0F2670F623',
			chainHeight: 2027193,
			finalization: {
				height: 2031992,
				epoch: 1413,
				point: 7,
				hash: '6B687D9B689611C90A1094A7430E78914F22A2570C80D3E42D520EB08091A973'
			},
			nodeStatus: {
				apiNode: 'up',
				db: 'up'
			},
			restVersion: '2.4.2',
			restGatewayUrl: 'localhost.com',
			isHttpsEnabled: true
		};
	},
	nodeCommonField: {
		version: 16777989,
		publicKey: '016DC1622EE42EF9E4D215FA1112E89040DD7AED83007283725CE9BA550272F5',
		networkGenerationHashSeed: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
		port: 7900,
		networkIdentifier: 104,
		host: 'node.com',
		friendlyName: 'node',
		lastAvailable: '2023-02-19T12:36:04.524Z',
		hostDetail: {},
		location: '',
		ip: '127.0.0.1',
		organization: '',
		as: '',
		continent: '',
		country: '',
		region: '',
		city: '',
		district: '',
		zip: ''
	}
};

export default TestHelper;