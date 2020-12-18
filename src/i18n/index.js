const DEFAULT_LANGUAGE = 'en';
const locales = {
	en: require('./en.json')
};

export default (language, key) => {
	return (locales[language] && locales[language][key])
		? locales[language][key]
		: locales[DEFAULT_LANGUAGE][key];
};