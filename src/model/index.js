import { formatNumberOutput, omit } from '../utils';

const formatDetails = details => {
	return omit(['roundOk', 'id', 'nodeId'], details);
};

const getSubResultMap = results => {
	return results.reduce((map, obj, index) => {
		map['result' + (index + 1)] = formatDetails(obj);
		return map;
	}, {})
};

export class TestResult {
	constructor(value, passed, expectedValue, details) {
		const { createdAt, resultValid, round, ...rest } = details;

		this.value = value;
		this.passed = passed;
		this.expectedValue = expectedValue;
		this.details = {
			round,
			dateAndTime: createdAt, 
			...formatDetails({ ...rest }),
		};
	}
};

export class NodeRewardInfo {
	constructor(res) {
		this.nodeId = res.nodeInfo.id;
		this.main = new Main(res);
		this.chainInfo = new ChainInfo(res.testResultInfo);
		this.performance = new Performance(res.testResultInfo);
		this.payout = res.payout;
	}
};

export class Main {
	constructor(res) {
		this.friendlyName = res.nodeInfo.name;
		this.host = res.nodeInfo.restGatewayUrl;
		this.rewardProgram = res.nodeInfo.rewardProgram;
		this.round = res.testResults[0] && res.testResults[0].round;
		this.history = History.fromRes(res);
	}
}

export class History {
	static fromRes(res) {
		const rawHistoty = res.testResults;
		let formattedHistoty = [];

		
		if(rawHistoty && rawHistoty.length)
			formattedHistoty = rawHistoty
				.map(el => ({
					date: el.createdAt,
					passed: el.roundOk,
					details: formatDetails(el),
					round: el.round
				}))
				.reverse();

		return formattedHistoty;
	}
};


export class ChainInfo {
	constructor(res) {
		this.nodeBalance = new TestResult(
			formatNumberOutput(res.nodeBalanceResult.reportedBalance),
			res.nodeBalanceResult.resultValid,
			formatNumberOutput(res.nodeBalanceResult.expectedMinBalance),
			{
				...res.nodeBalanceResult,
				reportedBalance: formatNumberOutput(res.nodeBalanceResult.reportedBalance),
				expectedMinBalance: formatNumberOutput(res.nodeBalanceResult.expectedMinBalance),
			}
		);
		this.chainHeight = new TestResult(
			res.chainHeightResult.reportedHeight,
			res.chainHeightResult.resultValid,
			res.chainHeightResult.expectedHeight,
			res.chainHeightResult
		);
		this.chainPart = new TestResult(
			res.chainPartResult.reportedHash,
			res.chainPartResult.resultValid,
			res.chainPartResult.expectedHash,
			res.chainPartResult
		);
		// this.finalizationHeight = new TestResult(
		// 	'not provided',
		// 	false,
		// 	'not provided',
		// 	{}
		// );
		this.nodeVersion = new TestResult(
			res.nodeVersionResult.reportedNodeVersion ,
			res.nodeVersionResult.resultValid,
			res.nodeVersionResult.expectedNodeVersion ,
			res.nodeVersionResult
		);
	}
};

export class Performance {
	constructor(res) {
		this.responsiveness = new TestResult(
			`${res.responsivenessResult.numResponses} (${res.responsivenessResult.totalTime}ms)`,
			res.responsivenessResult.resultValid,
			res.responsivenessResult.numRequests,
			res.responsivenessResult
		);
		this.ping = new TestResult(
			`${res.nodePingResult.averageTime}ms`,
			res.nodePingResult.resultValid,
			null,//res.pingResult.averageTime,
			{
				...omit('pingResults', res.nodePingResult),
				...getSubResultMap(res.nodePingResult.pingResults)
			}
		);
		this.bandwidth = new TestResult(
			'',
			res.nodeBandwidthResult.resultValid,
			null,//res.nodeBandwidthResult,
			{
				...omit('bandwidthResults', res.nodeBandwidthResult),
				...getSubResultMap(res.nodeBandwidthResult.bandwidthResults)
			}
		);
		this.computingPower = new TestResult(
			'',
			res.computingPowerResult.resultValid,
			null,//res.computingPowerResult.,
			res.computingPowerResult
		);
	}
};

export class Payout {

};