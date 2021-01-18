import { formatNumberOutput } from '../utils';

export class TestResult {
	constructor(value, passed, expectedValue, details) {
		const { createdAt, ...rest } = details;

		this.value = value;
		this.passed = passed;
		this.expectedValue = expectedValue;
		this.details = {
			dateAndTime: createdAt, 
			...rest 
		};
	}
};

export class NodeRewardInfo {
	constructor(res) {
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
		this.balance = new Balance(res.testResultInfo);
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
					passed: el.nodeVersionTestOk
						&& el.chainHeightTestOk
						&& el.chainPartTestOk
						&& el.responsivenessTestOk
						&& el.bandwidthTestOk
						&& el.computingPowerTestOk
						&& el.pingTestOk
						&& el.nodeBalanceTestOk,
					round: el.round,
					details: el
				}))
				.reverse();

		return formattedHistoty;
	}
};

export class Balance {
	constructor(res) {
		const testResult = new TestResult(
			formatNumberOutput(res.nodeBalanceResult.reportedBalance),
			res.nodeBalanceResult.resultValid,
			formatNumberOutput(res.nodeBalanceResult.expectedMinBalance),
			res.nodeBalanceResult
		);
		Object.assign(this, testResult);
	}
};

export class ChainInfo {
	constructor(res) {
		this.nodeBalance = new TestResult(
			res.nodeBalanceResult.reportedBalance,
			res.nodeBalanceResult.resultValid,
			res.nodeBalanceResult.expectedMinBalance,
			res.nodeBalanceResult
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
		this.bandwidth = new TestResult(
			res.bandwidthResult.speed,
			res.bandwidthResult.resultValid,
			'not provided',//res.bandwidthResult,
			res.bandwidthResult
		);
		this.computingPower = new TestResult(
			res.computingPowerResult.timeNeeded,
			res.computingPowerResult.resultValid,
			'not provided',//res.computingPowerResult.,
			res.computingPowerResult
		);
		this.ping = new TestResult(
			res.pingResult.averageTime,
			res.pingResult.resultValid,
			'not provided',//res.pingResult.averageTime,
			res.pingResult
		);
		this.responsiveness = new TestResult(
			`${res.responsivenessResult.numResponses} (${res.responsivenessResult.totalTime}ms)`,
			res.responsivenessResult.resultValid,
			res.responsivenessResult.numRequests,
			res.responsivenessResult
		);
	}
};

export class Payout {

};