<template>
	<Card :loading="loading">
		<template #title>
			{{getNameByKey('nodeCountChartTitle')}}
		</template>

		<template #body>
			<b-row style="margin: -20px;">
				<b-col>
					<Chart
						type="line"
						:data="chartData"
						:height="265"
						xaxisType="datetime"
						strokeCurve="straight"
					/>
				</b-col>
			</b-row>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import Chart from '@/components/Chart.vue';
import { mapGetters } from 'vuex';

export default {
	components: {
		Card,
		Chart
	},

	computed: {
		...mapGetters({
			nodeCountSeries: 'statistic/getNodeCountSeries',
			loading: 'statistic/getLoadingNodeCountSeries'
		}),

		chartData () {
			return this.nodeCountSeries;
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>
