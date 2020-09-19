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
				this.data.type === TransactionType.MOSAIC_SUPPLY_CHANGE ||
				this.data.type === TransactionType.AGGREGATE_COMPLETE ||
				this.data.type === TransactionType.AGGREGATE_BONDED ||
				this.data.type === TransactionType.HASH_LOCK ||
				this.data.type === TransactionType.SECRET_PROOF ||
				this.data.type === TransactionType.VRF_KEY_LINK ||
				this.data.type === TransactionType.ACCOUNT_KEY_LINK ||
				this.data.type === TransactionType.NODE_KEY_LINK ||
				this.data.type === TransactionType.VOTING_KEY_LINK;
		},

		isAggregate() {
			return process.env.NODE_ENV === 'development' && (
				this.data.type === TransactionType.AGGREGATE_COMPLETE ||
				this.data.type === TransactionType.AGGREGATE_BONDED
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
