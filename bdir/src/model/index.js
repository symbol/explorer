import { formatNumberOutput, omit } from '../utils';
import { NodeVersion } from 'symbol-sdk';

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
		if(res.nodeBalanceResult) {
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
		}
		if(res.chainHeightResult) {
			this.chainHeight = new TestResult(
				res.chainHeightResult.reportedHeight,
				res.chainHeightResult.resultValid,
				res.chainHeightResult.expectedHeight,
				res.chainHeightResult
			);
		}
		if(res.chainPartResult) {
			this.chainPart = new TestResult(
				res.chainPartResult.reportedHash,
				res.chainPartResult.resultValid,
				res.chainPartResult.expectedHash,
				res.chainPartResult
			);
		}
		if(res.nodeVersionResult) {
			const reportedNodeVersion = NodeVersion
				.createFromRawNodeVersion(res.nodeVersionResult.reportedNodeVersion)
				.formatted();
			const expectedNodeVersion = NodeVersion
				.createFromRawNodeVersion(res.nodeVersionResult.expectedNodeVersion)
				.formatted();
				
			this.nodeVersion = new TestResult(
				reportedNodeVersion,
				res.nodeVersionResult.resultValid,
				expectedNodeVersion,
				{
					...res.nodeVersionResult,
					reportedNodeVersion,
					expectedNodeVersion
				}
			);
		}
	}
};

export class Performance {
	constructor(res) {
		if(res.responsivenessResult) {
			this.responsiveness = new TestResult(
				`${res.responsivenessResult.numResponses} (${res.responsivenessResult.totalTime}ms)`,
				res.responsivenessResult.resultValid,
				res.responsivenessResult.numRequests,
				res.responsivenessResult
			);
		}
		if(res.nodePingResult) {
			this.ping = new TestResult(
				`${res.nodePingResult.averageTime}ms`,
				res.nodePingResult.resultValid,
				null,
				{
					...omit('pingResults', res.nodePingResult),
					...getSubResultMap(res.nodePingResult.pingResults)
				}
			);
		}
		if(res.nodeBandwidthResult) {
			this.bandwidth = new TestResult(
				'',
				res.nodeBandwidthResult.resultValid,
				null,
				{
					...omit('bandwidthResults', res.nodeBandwidthResult),
					...getSubResultMap(res.nodeBandwidthResult.bandwidthResults)
				}
			);
		}
		if(res.computingPowerResult) {
			this.computingPower = new TestResult(
				'',
				res.computingPowerResult.resultValid,
				null,
				res.computingPowerResult
			);
		}
	}
};