<template>
	<Card :loading="loading" v-if="isWidgetShown">
		<template #title>{{getNameByKey('transactionGraphic')}}</template>

		<template #body>
			<div class="body">

				<div v-if="isAggregate" :class="aggregateContainerClass">
					<div class="aggregate-title">{{ aggregateTitle }}</div>
					<div
						class="aggregate-inner"
						v-for="(innerTransactionData, index) in data.innerTransactions"
						:key="'tgw' + index"
					>
						<div class="aggregate-inner-index">
							{{index + 1}}
						</div>
						<TransactionGraphic
							:data="innerTransactionData"
						/>
					</div>
				</div>
				<TransactionGraphic v-else :data="data" />
			</div>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import GraphicComponent from '../graphics/GraphicComponent.vue';
import TransactionGraphic from '@/components/transaction-graphic/TransactionGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	props: {
		managerGetter: String
	},

	components: {
		Card,
		TransactionGraphic
	},

	data() {
		return {
			TransactionType,
			supportedTransactionTypes: [
				TransactionType.TRANSFER,
				TransactionType.ADDRESS_ALIAS,
				TransactionType.MOSAIC_ALIAS,
				TransactionType.NAMESPACE_REGISTRATION,
				TransactionType.SECRET_LOCK,
				TransactionType.MOSAIC_DEFINITION,
				TransactionType.MOSAIC_SUPPLY_CHANGE,
				TransactionType.AGGREGATE_COMPLETE,
				TransactionType.AGGREGATE_BONDED,
				TransactionType.HASH_LOCK,
				TransactionType.SECRET_PROOF,
				TransactionType.VRF_KEY_LINK,
				TransactionType.ACCOUNT_KEY_LINK,
				TransactionType.NODE_KEY_LINK,
				TransactionType.VOTING_KEY_LINK,
				TransactionType.MOSAIC_GLOBAL_RESTRICTION,
				TransactionType.MOSAIC_ADDRESS_RESTRICTION,
				TransactionType.ACCOUNT_OPERATION_RESTRICTION,
				TransactionType.ACCOUNT_ADDRESS_RESTRICTION,
				TransactionType.ACCOUNT_MOSAIC_RESTRICTION,
				TransactionType.ACCOUNT_METADATA,
				TransactionType.NAMESPACE_METADATA
			]
		};
	},

	computed: {
		isWidgetShown() {
			return this.isTransactionTypeSupported(this.data.type);
		},

		isAggregate() {
			return (
				(
					this.data.type === TransactionType.AGGREGATE_COMPLETE ||
					this.data.type === TransactionType.AGGREGATE_BONDED
				) &&
				(
					process.env.NODE_ENV === 'development' ||
					this.data?.innerTransactions?.every(inner => this.isTransactionTypeSupported(inner.type) === true)
				)
			);
		},

		aggregateTitle() {
			return this.getTransactionTypeCaption(this.data.type);
		},

		aggregateContainerClass() {
			const isMobile = this.$store.getters['ui/isMobile'];

			if (isMobile)
				return 'aggregate-container-mobile';
			return 'aggregate-container';
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
		},

		isTransactionTypeSupported(type) {
			return !!this.supportedTransactionTypes.find(transactionType => transactionType === type);
		}
	}
};
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    justify-content: center;

    .aggregate-container {
        border-style: dashed;
        border-radius: 10px;
        border-color: var(--orange);
        border-width: 4px;

        .aggregate-title {
            font-size: 1.5rem;
            line-height: 150%;
            color: var(--orange);
            font-weight: 700;
            margin: 20px 40px 0;
        }

        .aggregate-inner {
            position: relative;
            padding: 0 40px;

            .aggregate-inner-index {
                position: absolute;
                top: 43%;
                left: 40px;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--orange);
            }
        }
    }

    .aggregate-container-mobile {
        .aggregate-title {
            width: 100%;
            text-align: center;
            font-weight: 700;
            color: var(--orange);
        }
    }
}
</style>
