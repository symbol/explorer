<template>
	<Card :loading="loading">
		<template #title>
			{{getNameByKey('baseInfo')}}
		</template>

		<template #control>
			<router-link to="/statistics">
				<ButtonMore> {{getNameByKey('viewMoreStatistics')}} </ButtonMore>
			</router-link>
		</template>

		<template #body>
			<b-container fluid style="height: 100%;">
				<b-row>
					<!-- <b-col class="ex-item" sm="3" lg="12">
						<div class="ex-item-title">
							{{getNameByKey('price')}}
						</div>
						<div class="ex-item-value">
							{{marketData.price}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="3" lg="12">
						<div class="ex-item-title">
							{{getNameByKey('marketCap')}}
						</div>
						<div class="ex-item-value">
							{{marketData.marketCap}}
						</div>
					</b-col> -->
					<b-col class="ex-item" sm="2" lg="2">
						<div class="ex-item-title">
							{{getNameByKey('totalTransactions')}}
						</div>
						<div class="ex-item-value">
							{{storageInfo.numTransactions}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="2" lg="2">
						<div class="ex-item-title">
							{{getNameByKey('chainHeight')}}
						</div>
						<div class="ex-item-value">
							{{currentHeight}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="2" lg="2" :title="getNameByKey('finalizedHeight')">
						<div class="ex-item-title">
							{{ getNameByKey('finalizedHeight') }}
						</div>
						<div class="ex-item-value">
							{{finalizedHeight}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="2" lg="2" :title="getNameByKey('epoch')">
						<div class="ex-item-title">
							{{ getNameByKey('lastEpoch') }}
						</div>
						<div class="ex-item-value">
							{{ lastEpoch }} -
							<Age :date="lastEpochAge"/>
						</div>
					</b-col>
					<b-col class="ex-item" sm="2" lg="2" :title="getNameByKey('epoch')">
						<div class="ex-item-title">
							{{ getNameByKey('currentEpoch') }}
						</div>
						<div class="ex-item-value">
							{{epoch}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="2" lg="2">
						<div class="ex-item-title">
							{{ getNameByKey('nodes') }}
						</div>
						<div class="ex-item-value">
							{{nodeCount}}
						</div>
					</b-col>
				</b-row>
			</b-container>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import ButtonMore from '@/components/controls/ButtonMore.vue';
import Age from '@/components/fields/Age.vue';
import { mapGetters } from 'vuex';

export default {
	components: {
		Card,
		ButtonMore,
		Age
	},

	computed: {
		...mapGetters({
			chainInfo: 'chain/getChainInfo',
			storageInfo: 'chain/getStorageInfo',
			marketData: 'chain/getMarketData',
			nodeStats: 'chain/getNodeStats',
			loading: 'chain/getLoading'
		}),

		currentHeight () {
			return this.chainInfo.currentHeight;
		},

		epoch () {
			return this.chainInfo.epoch;
		},

		finalizedHeight () {
			return this.chainInfo.finalizedBlockHeight;
		},

		lastEpoch () {
			return this.chainInfo.lastEpoch.epoch;
		},

		lastEpochAge () {
			return this.chainInfo.lastEpoch.age;
		},

		nodeCount () {
			return this.nodeStats?.total || '-';
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.ex-item {
    padding: 1px 10px;
    margin-bottom: 15px;
    text-transform: uppercase;

    .ex-item-title {
        color: var(--text-color);
        font-size: 12px;
    }

    .ex-item-value {
        color: var(--text-color);
        text-align: left;
        font-size: 14px;
        margin: 4px 0 0;
    }
}
</style>
