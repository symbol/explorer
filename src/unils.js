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
	let mosaicPreviw = {
		mosaicName: '',
		amountInt: '',
		amountDec: ''
	};

	if(mosaic) {
		mosaicPreviw.mosaicName = mosaic.mosaicName
			.substring(mosaic.mosaicName.indexOf('.') + 1);

		const amountD = mosaic.amount.split('.');
		if(amountD.length === 2)
			mosaicPreviw.amountDec = '.' + amountD[1];
		mosaicPreviw.amountInt = amountD[0];
	}

	return mosaicPreviw;
}	