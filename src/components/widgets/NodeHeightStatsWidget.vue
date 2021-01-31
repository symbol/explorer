<template>
	<Card v-if="!error" :loading="loading" style="width: 100%">
		<template #title>
			{{getNameByKey('nodeHeightStatsTitle')}}
		</template>

		<template #body>
			<b-row style="margin: -20px">
				<b-col>
					<Chart
						type="bar"
						:height="chartHeight"
						:data="chartData"
						:intXaxis="true"
						:intYaxis="true"
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

	data() {
		return {
			managerGetter: 'statistic/nodeHeightStats'
		}
	},

	computed: {
		manager() {
			return this.getter(this.managerGetter) || {};
		},

		data() {
			return this.dataGetter
				? this.getter(this.dataGetter)
				: this.manager.data;
		},

		chartData() {
			return this.data || [];
		},


		loading() {
			return this.manager.loading;
		},

		error() {
			return this.manager.error;
		},

		chartHeight() {
			const data = this.data || [];
			const heightCount = data[0]?.data?.length || 0;
			const finalizedHeightCount = data[1]?.data.length || 0;
			const count = Math.max(heightCount, finalizedHeightCount);

			if(count === 0)
				return 40;
			
			const heightDelta = data[0].data[heightCount - 1][0] - data[0].data[0][0];
			const finalizedHeightDelta = data[1].data[heightCount - 1][0] - data[1].data[0][0];
			const delta = Math.max(heightDelta, finalizedHeightDelta);

			console.log('count', count)
			console.log('data', JSON.stringify(data))
			return 200 + delta / 1000;
			//return (count * 60) / (count * 0.3);
		}
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter(name) {
			return this.$store.getters[name];
		}
	}
};
</script>

<style lang="scss" scoped>
.ex-ns-group {
	font-weight: bold;
	font-size: 12px;
	color: $secondary-color;
	padding: 10px 0 5px;
}

@media (max-width: 760px) { 
	.ex-item {
		border-left: 4px solid #904d9c;
		padding: 1px 10px;
		margin-bottom: 15px;
		max-width: 150px;
	}
}

.ex-item {
    border-left: 4px solid #904d9c;
    padding: 1px 10px;
    margin-bottom: 15px;
}

.item-noborder {
	border-left: none;
	padding-left: 0;
}

.ex-text-break {
	word-break: break-all;
}

.ex-item-title {
	color: rgb(187, 187, 187);
	font-size: 12px;
}

.ex-item-value {
	color: rgb(85, 85, 85);
	text-align: left;
	font-size: 14px;
	margin: 4px 0 0;
}

.node-program-icon {
	height: 32px;
	margin: auto 0;
}

.blue {
	border-color: $blue-color;
}

.pink {
	border-color: $pink-color;
}


.green {
	border-color: $green-color;
}

.orange {
	border-color: $orange-color;
}

</style>
