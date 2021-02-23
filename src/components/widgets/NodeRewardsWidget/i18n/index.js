import { DEFAULT_LANGUAGE } from '../config.json';
import en from './en.json';

const locales = {
	en
};

const insertOptions = (text, options) => {
	if (!text || !options)
		return text;

	let result = '' + text;

	Object.keys(options)
		.forEach(key => {
			result = result.replace(`{${key}}`, options[key]);
		});

	return result;
};

export default (language, key, options) => {
	return ((locales[language] && locales[language][key])
		? insertOptions(locales[language][key], options)
		: insertOptions(locales[DEFAULT_LANGUAGE][key], options)) ||
            (options
            	? Object.values(options)[0]
            	: key);
};
