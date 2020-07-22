<template>
	<Card :loading="loading" v-if="isWidgetShown">
		<template #title>{{getNameByKey('transactionGraphic')}}</template>

		<template #body>
			<div class="body">
				<div v-if="isAggregate">
					<TransactionGraphic 
						v-for="(innerTransactionData, index) in data.innerTransactions"
						:data="innerTransactionData" 
						:key="'tgw' + index"
					/>
				</div>
				<TransactionGraphic v-else v-bind="data" />
			</div>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import TransactionGraphic from '@/components/transaction-graphic/TransactionGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	mounted() {
		setInterval(() => {
			console.log('DATA', this.data)
		}, 5000)	
	},
	props: {
		managerGetter: String
	},

	components: {
		Card,
		TransactionGraphic,
	},

	data() {
		return {
			TransactionType
		};
	},

	computed: {
		isWidgetShown() {
			return this.data.type === TransactionType.TRANSFER ||
				this.data.type === TransactionType.ADDRESS_ALIAS ||
				this.data.type === TransactionType.MOSAIC_ALIAS ||
				this.data.type === TransactionType.NAMESPACE_REGISTRATION ||
				this.data.type === TransactionType.MOSAIC_DEFINITION ||
				this.data.type === TransactionType.AGGREGATE_COMPLETE||
				this.data.type === TransactionType.AGGREGATE_BONDED;
		},

		isAggregate() {
			return this.data.type === TransactionType.AGGREGATE_COMPLETE ||
				this.data.type === TransactionType.AGGREGATE_BONDED;
		},

		data() {
			return this.$store.getters[this.managerGetter].data;
		},

		loading() {
			return this.$store.getters[this.managerGetter].loading;
		},

		error() {
			return this.$store.getters[this.managerGetter].error;
		}
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    justify-content: center;
}
</style>
