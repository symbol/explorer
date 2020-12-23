const DEFAULT_LANGUAGE = 'en';
const locales = {
	en: require('./en.json')
};

const insertOptions = (text, options) => {
	if(!options)
		return text;

	let result = '' + text;
	
	Object.keys(options)
		.forEach(key => {
			result = result.replace(`{${key}}`, options[key]);
		});
		
	return result;
}

export default (language, key, options) => {
	return ((locales[language] && locales[language][key])
		? insertOptions(locales[language][key], options)
		: insertOptions(locales[DEFAULT_LANGUAGE][key], options))
			|| insertOptions(key, options);
};