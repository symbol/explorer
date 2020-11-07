import Constants from '../config/constants';
import helper from '../helper';
import { Mosaic } from 'symbol-sdk';

class CreateReceiptTransaction {
    static balanceChangeReceipt = async (transactionStatement) => {
    	let balanceChangeReceipt = [];

    	const mosaics = transactionStatement.map(
    		statement => new Mosaic(statement.mosaicId, statement.amount)
    	);

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		balanceChangeReceipt.push({
    			...statement,
    			height: statement.height.compact(),
  				receiptType: Constants.ReceiptType[statement.type],
  				targetAddress: statement.targetAddress.plain(),
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex())]
    		});
    	}

    	return balanceChangeReceipt;
    }

    static balanceTransferReceipt = async (transactionStatement) => {
    	let balanceTransferReceipt = [];

    	const mosaics = transactionStatement.map(
    		statement => new Mosaic(statement.mosaicId, statement.amount)
    	);

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		balanceTransferReceipt.push({
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
  				senderAddress: statement.senderAddress.address,
  				recipient: statement.recipientAddress.address,
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex())]
    		});
    	}

    	return balanceTransferReceipt;
    }

    static inflationReceipt = async (transactionStatement) => {
    	let inflationReceipt = [];

    	const mosaics = transactionStatement.map(
    		statement => new Mosaic(statement.mosaicId, statement.amount)
    	);

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		inflationReceipt.push({
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex())]
    		});
    	}

    	return inflationReceipt;
    }

    static artifactExpiryReceipt = async (transactionStatement) => {
    	let artifactExpiryReceipt = [];

    	for (const statement of transactionStatement) {
    		artifactExpiryReceipt.push({
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
    			artifactId: statement.artifactId.toHex()
    		});
    	}

    	return artifactExpiryReceipt;
    }
}

export default CreateReceiptTransaction;
