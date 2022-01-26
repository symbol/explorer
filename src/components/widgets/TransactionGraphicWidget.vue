<template>
	<Card :loading="loading" v-if="isWidgetShown">
		<template #title>{{getNameByKey('transactionGraphic')}}</template>

		<template #body>
			<div class="body">
				<div v-if="isAggregate" :class="aggregateContainerClass">
					<div class="aggregate-title">{{ aggregateTitle }}</div>
					<div v-if="cosigners.length" class="signers-section-wrapper">
						<div class="signers-section">
							<img :src="SignatureIcon" class="signature-icon" />
							<svg
								v-for="(address, index) in cosigners"
								:key="'tg-cos' + index"
								class="cosigner"
								viewBox="35 35 60 60"
								:width="64"
								:height="64"
							>
								<AccountIcon
									:width="128"
									:height="128"
									:address="address"
								/>
							</svg>
						</div>
					</div>
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
import SignatureIcon from '../../styles/img/signature.png';
import Card from '@/components/containers/Card.vue';
import GraphicComponent from '../graphics/GraphicComponent.vue';
import AccountIcon from '../graphics/AccountIcon.vue';
import TransactionGraphic from '@/components/transaction-graphic/TransactionGraphic.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	props: {
		managerGetter: String
	},

	components: {
		Card,
		TransactionGraphic,
		AccountIcon
	},

	data () {
		return {
			TransactionType,
			SignatureIcon,
			supportedTransactionTypes: [
				TransactionType.TRANSFER,
				TransactionType.ADDRESS_ALIAS,
				TransactionType.MOSAIC_ALIAS,
				TransactionType.NAMESPACE_REGISTRATION,
				TransactionType.SECRET_LOCK,
				TransactionType.MOSAIC_DEFINITION,
				TransactionType.MOSAIC_SUPPLY_CHANGE,
				TransactionType.MOSAIC_SUPPLY_REVOCATION,
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
				TransactionType.MULTISIG_ACCOUNT_MODIFICATION,
				TransactionType.ACCOUNT_METADATA,
				TransactionType.NAMESPACE_METADATA,
				TransactionType.MOSAIC_METADATA
			]
		};
	},

	computed: {
		isWidgetShown () {
			return this.isTransactionTypeSupported(this.data.type);
		},

		isAggregate () {
			return (
				this.data.type === TransactionType.AGGREGATE_COMPLETE ||
				this.data.type === TransactionType.AGGREGATE_BONDED
			);
		},

		aggregateTitle () {
			return this.getTransactionTypeCaption(this.data.type);
		},

		isMobile () {
			return this.$store.getters['ui/isMobile'];
		},

		aggregateContainerClass () {
			const { isMobile } = this;

			if (isMobile)
				return 'aggregate-container-mobile';
			return 'aggregate-container';
		},

		data () {
			return this.$store.getters[this.managerGetter].data;
		},

		cosigners () {
			if (this.data.type === TransactionType.AGGREGATE_BONDED) {
				return [
					this.data.signer,
					...this.data.cosignatures.map(cosignature => cosignature.signer)
				];
			}
			return [];
		},

		loading () {
			return this.$store.getters[this.managerGetter].loading;
		},

		error () {
			return this.$store.getters[this.managerGetter].error;
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		isTransactionTypeSupported (type) {
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
        border-width: 2px;

        .aggregate-title {
            font-size: 1rem;
            line-height: 150%;
            color: var(--orange);
            font-weight: 700;
            margin: 10px 15px 0;
        }

        .signers-section-wrapper {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            flex: 1;

            .signers-section {
                margin: 10px 40px 0;
                position: relative;
                display: inline-block;
                width: auto;
                max-width: 700px;
                background: var(--sub-card-bg);
                padding: 0 20px 10px;
                border-radius: 40px;
                border: 1px solid var(--sub-card-border);

                .signature-icon {
                    position: absolute;
                    height: 40px;
                    top: -10px;
                    right: -5px;
                }
            }
        }

        .aggregate-inner {
            position: relative;
            padding: 0 40px;

            .aggregate-inner-index {
                position: absolute;
                top: 35%;
                left: 40px;
                font-size: 1rem;
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

        .signers-section-wrapper {
            display: none;
        }

        .aggregate-inner {
            .aggregate-inner-index {
                display: none;
            }
        }
    }
}
</style>
