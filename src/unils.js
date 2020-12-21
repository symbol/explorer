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

export const formatDate = (dateStr, language) => {
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
	const month = translate(language, months[dateObj.getMonth()]);
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();
	
	return `${month} ${day}, ${year}`;
}