import { DEFAULT_NATIVE_MOSAIC_NAME } from './config.json';
import translate from './i18n';

export const trunc = (text, cut, lengthFirst, lengthSecond) => {
	if (cut === 'middle' && lengthFirst + lengthSecond < text.length) {
		return text.substring(0, lengthFirst) + '...' + text.substring(text.length - lengthSecond, text.length);
	}
	if (cut === 'end' && lengthFirst < text.length) {
		return text.substring(0, lengthFirst) + '...';
	}

	return text;
};

export const formatNumberOutput = (value) => {
	if(typeof value === 'string')
		parseFloat(value).toLocaleString('en');
	
	if(typeof value === 'number')
		(value).toLocaleString('en');
	
	return value.toLocaleString('en')
}

export const formatDate = (dateStr, language, showTime = false) => {
	const months = [
		'jan',
		'feb',
		'mar',
		'apr',
		'may',
		'jun',
		'jul',
		'aug',
		'sep',
		'oct',
		'nov',
		'dec'
	];

	const dateObj = new Date(dateStr);
	const seconds = dateObj.getSeconds();
	const minutes = dateObj.getMinutes();
	const hour = dateObj.getHours();
	const month = translate(language, months[dateObj.getMonth()]);
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();
	
	const formattedDate = `${month} ${day}, ${year}` + (showTime ? ` ${hour}:${minutes}:${seconds}` : '');

	return formattedDate;
}

export const getNativeMosaicPreview = (mosaics, nativeMosaic) => {
	const mosaic = nativeMosaic
		? mosaics.find(el => el.mosaicName === nativeMosaic.mosaicName)
		: mosaics[0];
	const rawMosaicName = mosaic.mosaicName || DEFAULT_NATIVE_MOSAIC_NAME;
	let mosaicPreview = {
		mosaicName: '',
		amountInt: '',
		amountDec: ''
	};

	if(typeof mosaic === 'object') {
		mosaicPreview.mosaicName = rawMosaicName
			.substring(rawMosaicName.indexOf('.') + 1);

		const amountD = mosaic.amount.split('.');
		if(amountD.length === 2)
			mosaicPreview.amountDec = '.' + amountD[1];
		mosaicPreview.amountInt = amountD[0];
	}
	else if(typeof mosaic === 'string') {
		mosaicPreview.mosaicName = rawMosaicName
			.substring(rawMosaicName.indexOf('.') + 1);

		const amountD = mosaic.split('.');
		if(amountD.length === 2)
			mosaicPreview.amountDec = '.' + amountD[1];
		mosaicPreview.amountInt = amountD[0]
	}

	return mosaicPreview;
}

export const omit = (key, obj) => {
	if(Array.isArray(key))
		return Object.keys(obj)
			.filter(k => !key.includes(k))
			.reduce((acc, key) => ((acc[key] = obj[key]), acc), {});

	const { [key]: omitted, ...rest } = obj;
	return rest;
}