/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import Constants from '../config/constants';
import globalConfig from '../config/globalConfig';
import Axios from 'axios';

class StatisticService {
	/**
	 * Gets Block Time Difference dataset.
	 * The dataset in use for Chart.
	 * @param {array} blocks - streamer blocks.
	 * @param {number} grouping - grouping block for calculation.
	 * @returns {object} block time difference dataset.
	 */
	static getBlockTimeDifferenceData = (blocks, grouping) => {
		const heights = blocks.map(data => Number(data.height));

		let timestamps = blocks.map(data => data.timestampRaw);

		for (let i = 0; i < timestamps.length - 1; ++i)
			timestamps[i] -= timestamps[i + 1];

		let averages = [];

		let sum = 0;

		for (let i = 0; i < grouping; ++i)
			sum += timestamps[i];

		for (let i = grouping; i < timestamps.length; ++i) {
			averages.push(sum / grouping);
			sum -= timestamps[i - grouping];
			sum += timestamps[i];
		}
		averages.push(0);

		let timeDifferenceDataset = [];

		let averagesDataset = [];

		for (let i = 0; i < timestamps.length - 1; ++i) {
			let height = heights[i];

			let difference = timestamps[i] / 1000;

			let average = averages[i] / 1000;

			timeDifferenceDataset.push([height, difference.toFixed(2)]);
			averagesDataset.push([height, 'NaN' === average.toFixed(2) ? null : average.toFixed(2)]);
		}

		const sliceTimeDifferenceDataset = timeDifferenceDataset.slice(0, timeDifferenceDataset.length - grouping);
		const sliceAveragesDataset = averagesDataset.slice(0, averagesDataset.length - grouping);

		let dataset = [
			{
				name: 'Time Difference (in seconds)',
				data: sliceTimeDifferenceDataset
			},
			{
				name: `Average Time Difference (per ${grouping} blocks)`,
				data: sliceAveragesDataset
			}
		];

		return {
			limit: sliceTimeDifferenceDataset.length + 1,
			grouping: grouping,
			name: `Block time differences in last ${sliceTimeDifferenceDataset.length + 1} blocks`,
			data: dataset
		};
	}

	/**
	 * Gets Transaction data per block dataset
	 * The dataset in use for Chart.
	 * @param {array} blocks - streamer blocks.
	 * @param {number} grouping - grouping block for calculation
	 * @returns {object} transaction data per block dataset.
	 */
	static getTransactionPerBlockData = (blocks, grouping) => {
		const heights = blocks.map(data => Number(data.height));

		let numTransactions = blocks.map(data => data.transactions);

		let averages = [];

		let sum = 0;

		for (let i = 0; i < grouping; ++i)
			sum += numTransactions[i];

		for (let i = grouping; i < numTransactions.length; ++i) {
			averages.push(sum / grouping);
			sum -= numTransactions[i - grouping];
			sum += numTransactions[i];
		}
		averages.push(0);

		let numTransactionsPerBlockDataset = [];

		let averagesDataset = [];

		for (let i = 0; i < numTransactions.length - 1; ++i) {
			numTransactionsPerBlockDataset.push([heights[i], numTransactions[i]]);
			averagesDataset.push([heights[i], averages[i] === undefined ? 0 : averages[i].toFixed(2)]);
		}

		const sliceNumTransactionsPerBlockDataset = numTransactionsPerBlockDataset
			.slice(0, numTransactionsPerBlockDataset.length - grouping);
		const sliceAveragesDataset = averagesDataset.slice(0, averagesDataset.length - grouping);

		let dataset = [
			{
				name: 'Number of transactions',
				data: sliceNumTransactionsPerBlockDataset
			},
			{
				name: `Average number of transaction (per ${grouping} blocks)`,
				data: sliceAveragesDataset
			}
		];

		return {
			limit: sliceNumTransactionsPerBlockDataset.length + 1,
			grouping: grouping,
			name: `Transaction per block in last ${sliceNumTransactionsPerBlockDataset.length + 1} blocks`,
			data: dataset
		};
	}

	static getNodeCountSeries = async () => {
		const data = await StatisticService.fetchFromStatisticsService('/timeSeries/nodeCount');
		const chartData = StatisticService.formatChartData(data, ['1', '2', '3', '4', '5', '6', '7', 'total']);

		return chartData.map(el => ({ ...el, name: Constants.RoleType[el.name] || el.name }));
	}

	static fetchFromStatisticsService = async route => {
		if (this.isUrlProvided())
			return (await Axios.get(globalConfig.endpoints.statisticsService + route)).data;

		else
			throw Error('Statistics service endpoint is not provided');
	}

	static formatChartData = (data, includeKeys) => {
		const aggreagatedData = {};
		const isKeyIncluded = key => !includeKeys || includeKeys.includes(key);

		let chartData = [];

		data.forEach(doc => {
			Object.keys(doc.values).forEach(name => {
				if (!aggreagatedData[name] && isKeyIncluded(name)) {
					aggreagatedData[name] = {
						data: []
					};
				}

				if (isKeyIncluded(name)) {
					aggreagatedData[name].data.push({
						x: doc.date,
						y: doc.values[name]
					});
				}
			});
		});

		chartData = Object.keys(aggreagatedData).map(name => ({
			name,
			data: aggreagatedData[name].data
		}));

		return chartData;
	}

	static isUrlProvided () {
		try {
			new URL(globalConfig?.endpoints?.statisticsService); // eslint-disable-line no-new
			return true;
		} catch (e) {
			return false;
		}
	}
}

export default StatisticService;
