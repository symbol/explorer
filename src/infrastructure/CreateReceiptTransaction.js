import Constants from '../config/constants';
import helper from '../helper';
import { Mosaic, ReceiptType } from 'symbol-sdk';

class CreateReceiptTransaction {
    static balanceChangeReceipt = async transactionStatement => {
    	let balanceChangeReceipt = [];

    	const mosaics = transactionStatement.map(statement => new Mosaic(statement.mosaicId, statement.amount));

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		balanceChangeReceipt.push({
    			...statement,
    			height: statement.height.compact(),
  				receiptType: Constants.ReceiptType[statement.type],
  				targetAddress: statement.targetAddress.plain(),
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex() &&
					statement.amount.equals(mosaicFieldObject.rawAmount))]
    		});
    	}

    	return balanceChangeReceipt;
    }

    static balanceTransferReceipt = async transactionStatement => {
    	let balanceTransferReceipt = [];

    	const mosaics = transactionStatement.map(statement => new Mosaic(statement.mosaicId, statement.amount));

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		balanceTransferReceipt.push({
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
  				senderAddress: statement.senderAddress.address,
  				recipient: statement.recipientAddress.address,
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex() &&
					statement.amount.equals(mosaicFieldObject.rawAmount))]
    		});
    	}

    	return balanceTransferReceipt;
    }

    static inflationReceipt = async transactionStatement => {
    	let inflationReceipt = [];

    	const mosaics = transactionStatement.map(statement => new Mosaic(statement.mosaicId, statement.amount));

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder(mosaics);

    	for (const statement of transactionStatement) {
    		inflationReceipt.push({
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
    			mosaics: [mosaicsFieldObject.find(mosaicFieldObject => mosaicFieldObject.mosaicId === statement.mosaicId.toHex() &&
					statement.amount.equals(mosaicFieldObject.rawAmount))]
    		});
    	}

    	return inflationReceipt;
    }

    static artifactExpiryReceipt = async transactionStatement => {
    	let artifactExpiryReceipt = [];

    	for (const statement of transactionStatement) {
    		let artifactObj = {
    			...statement,
    			height: statement.height.compact(),
    			receiptType: Constants.ReceiptType[statement.type],
    			artifactId: statement.artifactId.toHex()
    		};

    		if (ReceiptType.Mosaic_Expired === statement.type)
    			Object.assign(artifactObj, { mosaicArtifactId: statement.artifactId.toHex() });
    		else if (ReceiptType.Namespace_Expired === statement.type || ReceiptType.Namespace_Deleted === statement.type)
    			Object.assign(artifactObj, { namespaceArtifactId: statement.artifactId.toHex() });

    		artifactExpiryReceipt.push(artifactObj);
    	}

    	return artifactExpiryReceipt;
    }
}

export default CreateReceiptTransaction;
