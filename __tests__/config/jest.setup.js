import { TextDecoder, TextEncoder } from 'util';

/* Mock init http */
jest.mock('../../src/infrastructure/http', () => {
	const { Address } = require('symbol-sdk');

	return {
		networkType: 152,
		epochAdjustment: 1615853185,
		generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
		networkCurrency: {
			divisibility: 6,
			mosaicId: '6BED913FA20223F8',
			namespaceId: 'E74B99BA41F4AFEE',
			namespaceName: 'symbol.xym'
		},
		networkConfig: {
			TargetBlockTime: 30,
			NetworkType: 152,
			NemsisTimestamp: 1637848847,
			NamespaceGraceDuration: 2880,
			TotalChainImportance: 7842928625000000,
			MosaicRentalSinkAddress: Address.createFromRawAddress('TATYW7IJN2TDBINTESRU66HHS5HMC4YVW7GGDRA')
		},
		nativeNamespaces: [
			{
				namespaceName: 'symbol'
			},
			{
				namespaceName: 'symbol.xym'
			}
		],
		accountLabels: {
			'TBNMIAJEUCUAQYUNEUP2FPULTOQ5SJ2ZTPNWXIA': 'Mock Exchange'
		},
		timezone: 'Local'
	};
});

Object.assign(global, {
	TextDecoder,
	TextEncoder,
	L: {
		markerClusterGroup: jest.fn().mockImplementation(() => ({
			addLayer: jest.fn(),
			addTo: jest.fn()
		}))
	}
});

// Mock leaflet (map library)
jest.mock('leaflet.markercluster', () => {}, { virtual: true });

jest.mock('leaflet', () => ({
	icon: jest.fn().mockImplementation(params => ({
		iconUrl: params.iconUrl
	})),
	marker: jest.fn().mockImplementation((coords, options) => ({
		bindPopup: jest.fn().mockReturnValue({})
	})),
	markerClusterGroup: jest.fn().mockReturnValue({
		addLayer: jest.fn()
	}),
	latLng: jest.fn().mockReturnValue([0, 0]),
	latLngBounds: jest.fn().mockReturnValue({
		extend: jest.fn()
	}),
	map: jest.fn().mockReturnValue({
		addLayer: jest.fn()
	}),
	tileLayer: jest.fn().mockReturnValue({
		addTo: jest.fn()
	})
}));
