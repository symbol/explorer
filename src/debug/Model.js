export class TestResult {
	constructor(value, passed, expectedValue, details) {
		this.value = value;
		this.passed = passed;
		this.expectedValue = expectedValue;
		this.details = details;
	}
};

export class NodeInfo {
	constructor(res) {
		this.nodeName = res.nodeAlias;
		this.balance = new Balance(res);
		this.history = History.fromRes(res);
		this.chainInfo = new ChainInfo(res);
		this.performance = new Performance(res);
		this.payout = res.payout;
	}
};

export class History {
	static fromRes(res) {
		const rawHistoty = res.nodeDetails;
		let formattedHistoty = [];
		
		if(rawHistoty && rawHistoty.length)
			formattedHistoty = rawHistoty.map(el => ({
				date: el.dateAndTime,
				passed: Math.random() < 0.5, // hardcode. No passed provided,
				round: el.round,
				details: el
			}));

		return formattedHistoty;
	}
};

export class Balance {
	constructor(res) {
		const testResult = new TestResult(
			res.nodeBalanceResults[0].reportedBalance,
			true, //hardcode. no 'passed' provided
			res.nodeBalanceResults[0].expectedMinBalance,
			res.nodeBalanceResults[0]
		);
		Object.assign(this, testResult);
	}
};

export class ChainInfo {
	constructor(res) {
		this.chainHeight = new TestResult(
			res.chainHeightResults[0].reportedHeight,
			true, //hardcode. no 'passed' provided,
			res.chainHeightResults[0].expectedHeight,
			res.chainHeightResults[0]
		);
		this.chainPart = new TestResult(
			'bf8c58d2a631641ab4c195a05b65325f3a6da34ab433e9119fc60df3bbca8442', //hardcode. String type needed. => res.chainPartResults.reportedHash,
			true, //hardcode. no 'passed' provided
			'bf8c58d2a631641ab4c195a05b65325f3a6da34ab433e9119fc60df3bbca8442', //hardcode. String type needed. => res.chainPartResults.expectedHash,
			res.chainPartResults[0]
		);
		this.finalizationHeight = new TestResult(
			1900,
			false,
			2000,
			{}
		);
		this.NISVersion = new TestResult(
			res.nodeVersionResults[0].reportedVersionTag ,
			true, //hardcode. no 'passed' provided
			res.nodeVersionResults[0].expectedVersionTag ,
			res.nodeVersionResults[0]
		);
	}
};

export class Performance {
	constructor(res) {
		this.bandwidth = new TestResult(
			0, //hardcode
			true, //hardcode. no 'passed' provided
			0, //hardcode
			res.bandwidthResults[0]
		);
		this.computingPower = new TestResult(
			'bf8c58d2a631641ab4c195a05b65325f3a6da34ab433e9119fc60df3bbca8442', //hardcode. String type needed. => res.computingPowerResults.reportedResult,
			true, //hardcode. no 'passed' provided
			'bf8c58d2a631641ab4c195a05b65325f3a6da34ab433e9119fc60df3bbca8442', //hardcode. String type needed. => res.computingPowerResults.expectedResult,
			res.computingPowerResults[0]
		);
		this.ping = new TestResult(
			res.pingResults.averageTime,
			true, //hardcode. no 'passed' provided
			res.pingResults.averageTime, //hardcode. No expected result provided,
			res.pingResults[0]
		);
		this.responsiveness = new TestResult(
			`${res.responsivenessResults[0].totalTime}ms (${res.responsivenessResults[0].numResponses}/${res.responsivenessResults[0].numRequests})`,
			true, //hardcode. no 'passed' provided
			res.responsivenessResults[0].expectedVersionTag ,
			res.responsivenessResults[0]
		);
	}
};

export class Payout {

};

