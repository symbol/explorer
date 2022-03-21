import {
	NetworkType,
	Account,
	NamespaceId,
	SHA3Hasher,
	Crypto,
	Mosaic,
	UInt64,
	MosaicId,
	TransactionInfo
} from 'symbol-sdk';

const generateRandomHash = (length = 32) => {
	const seed = Crypto.randomBytes(32);
	return SHA3Hasher.getHasher(length)
		.create()
		.update(seed)
		.hex()
		.toUpperCase();
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
	mockTransaction: blockHeight => {
		return {
			deadline: {
				adjustedValue: 8266897456
			},
			maxFee: UInt64.fromUint(1000000),
			type: 16724,
			networkType: NetworkType.TEST_NET,
			version: 1,
			transactionInfo: new TransactionInfo(UInt64.fromUint(blockHeight), 1, 1, generateRandomHash()),
			payloadSize: 176,
			signature: generateRandomHash(64),
			signer: {
				address: Account.generateNewAccount(NetworkType.TEST_NET).address
			},
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
	}
};

export default TestHelper;