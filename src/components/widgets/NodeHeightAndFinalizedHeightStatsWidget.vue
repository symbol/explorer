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
