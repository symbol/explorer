<template>
	<Card v-if="!error" :loading="loading">
		<template #title>
			{{ title }}
		</template>

		<template #body>
			<b-row style="margin: -20px;">
				<b-col>
					<Chart
						type="bar"
						:height="chartHeight"
						:data="chartData"
						:intXaxis="false"
						:intYaxis="true"
						:colorIndex="colorIndex"
						xaxisType="category"
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
			managerGetter: 'statistic/nodeHeightStats'
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

		title () {
			const titleMap = {
				0: this.getNameByKey('nodeHeightStatsTitle'),
				1: this.getNameByKey('nodeFinalizedHeightStatsTitle')
			};

			return titleMap[this.typeIndex];
		},

		chartData () {
			return (this.data && [this.data[this.typeIndex]]) || [];
		},

		loading () {
			return this.manager.loading;
		},

		error () {
			return this.manager.error;
		},

		typeIndex () {
			const typeMap = {
				height: 0,
				finalizedHeight: 1
			};

			return typeMap[this.type];
		},

		colorIndex () {
			const colorMap = {
				0: 0,
				1: 1
			};

			return colorMap[this.typeIndex];
		},

		chartHeight () {
			// const data = this.data || [];
			// const heightCount = data[0]?.data?.length || 0;
			// const finalizedHeightCount = data[1]?.data.length || 0;
			// const count = Math.max(heightCount, finalizedHeightCount);

			// if(count === 0)
			// 	return 40;

			// const heightDelta = data[0].data[heightCount - 1][0] - data[0].data[0][0];
			// const finalizedHeightDelta = data[1].data[heightCount - 1][0] - data[1].data[0][0];
			// const delta = Math.max(heightDelta, finalizedHeightDelta);

			// console.log('count', count)
			// console.log('data', JSON.stringify(data))
			// return 200 + delta / 1000;

			const data = this.chartData[0]?.data || [];
			const count = data?.length || 0;

			if (0 === count)
				return 200;

			return 200 + count * 12;
		}
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
