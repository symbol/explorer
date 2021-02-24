import axios from 'axios';
const PAYOUTS_ROUTE = '/nodeRewards/payouts';

export class PayoutService {
	constructor(statisticsServiceEndpoint, nodeId) {
		this.statisticsServiceEndpoint = statisticsServiceEndpoint;
		this.nodeId = nodeId;

		this.data = [];
		this.canFetchNext = true;
		this.loading = false;
		this.error = false;
		this.errorMessage = '';

		this.pageNumber = 1;
	}

	async init() {
		this.data = [];
		this.loading = true;
		this.error = false;
		this.errorMessage = '';
		this.pageNumber = 1;

		await this.fetchNext();
	}

	async fetchNext() {
		this.loading = true;
		this.error = false;
		this.errorMessage = '';

		if (this.canFetchNext) {
			try {
				this.data = (await axios.get(
					this.statisticsServiceEndpoint + PAYOUTS_ROUTE,
					{
						params: {
							nodeId: this.nodeId,
							pageNumber: this.pageNumber
						}
					}
				))
					.data.data;

				if (!this.data.length)
					this.canFetchNext = false;

				this.pageNumber++;
			}
			catch (e) {
				this.error = true;
				this.errorMessage = 'error_failed_to_fetch';
				console.error('Failed to fetch payout list', e);
			}
		}

		this.loading = false;
	}
}
