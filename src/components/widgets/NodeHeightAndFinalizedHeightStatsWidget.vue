<template>
	<Card v-if="!error" :loading="loading">
		<template #title>
			{{getNameByKey('nodeHeightAndFinalizedHeightStatsTitle')}}
		</template>

		<template #body>
			<b-row style="margin: -20px;">
				<b-col>
					<Chart
						type="bubble"
						:data="chartData"
						xaxisType="category"
						:height="400"
						:xaxisRange="xaxisRange"
						:yaxisRange="yaxisRange"
					/>
				</b-col>
			</b-row>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import Chart from '@/components/Chart.vue';

export default {
	components: {
		Card,
		Chart
	},

	props: {
		type: {
			type: String,
			default: 'height'
		}
	},

	data () {
		return {
			managerGetter: 'statistic/nodeHeightAndFinalizedHeightStats'
		};
	},

	computed: {
		manager () {
			return this.getter(this.managerGetter) || {};
		},

		data () {
			return this.dataGetter
				? this.getter(this.dataGetter)
				: this.manager.data;
		},

		chartData () {
			return this.data || [];
		},

		// Calculate axis ranges for bubble chart to ensure full circles
		xaxisRange () {
			if (!this.chartData || this.chartData.length === 0) return null;

			const allXValues = [];
			this.chartData.forEach(series => {
				series.data.forEach(point => {
					allXValues.push(point.x);
				});
			});

			const minX = Math.min(...allXValues);
			const maxX = Math.max(...allXValues);
			const range = (maxX - minX) * 0.05;

			// Add padding to ensure bubbles don't get cut off
			return [minX - range, maxX + range];
		},

		yaxisRange () {
			if (!this.chartData || this.chartData.length === 0) return null;

			const allYValues = [];
			this.chartData.forEach(series => {
				series.data.forEach(point => {
					allYValues.push(point.y);
				});
			});

			const minY = Math.min(...allYValues);
			const maxY = Math.max(...allYValues);
			const range = (maxY - minY) * 0.5;

			// Add padding to ensure bubbles don't get cut off
			return [Math.max(0, minY - range), maxY + range];
		},

		loading () {
			return this.manager.loading;
		},

		error () {
			return this.manager.error;
		},
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter (name) {
			return this.$store.getters[name];
		}
	}
};
</script>
