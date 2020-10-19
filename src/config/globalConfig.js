const defaultGlobalConfig = {
	'peersApi': {
		'defaultNode': 'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000',
		'nodes': [
			'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000',
			'http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000',
			'http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000',
			'http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000',
			'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000',
			'http://api-01.us-west-1.0.10.0.x.symboldev.network:3000'
		]
	},
	'apiNodePort': 3000,
	'endpoints': {
		'marketData': 'https://min-api.cryptocompare.com/',
		'statisticsService': ''
	},
	'networkConfig': {
		'namespaceName': 'SYMBOL.XEM',
		'mosaicId': '5B66E76BECAD0860',
		'divisibility': '6'
	},
	'footer': {
		'link': [{
			'href': 'https://nemflash.io/',
			'text': 'NEM News',
			'icon': 'IconNewspaper'
		},
		{
			'href': 'https://forum.nem.io/',
			'text': 'Forum',
			'icon': 'IconForum'
		},
		{
			'href': 'https://t.me/nemred',
			'text': 'Telegram',
			'icon': 'IconTelegram'
		},
		{
			'href': 'https://www.reddit.com/r/nem/',
			'text': 'Reddit',
			'icon': 'IconReddit'
		},
		{
			'href': 'https://github.com/nemtech',
			'text': 'Github',
			'icon': 'IconGithub'
		},
		{
			'href': 'http://faucet-0.10.0.x-01.symboldev.network/',
			'text': 'Faucet-01',
			'icon': 'IconHomeCurrencyUsd'
		},
		{
			'href': 'http://faucet-0.10.0.x-02.symboldev.network/',
			'text': 'Faucet-02',
			'icon': 'IconHomeCurrencyUsd'
		}
		]
	}
};

// TODO Migrate this to a rest ajax call instead of a global window variable.
const globalConfig = window.globalConfig || defaultGlobalConfig;

export default globalConfig;
