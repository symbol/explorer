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
			<b-container fluid style="height: 100%">
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
					<b-col class="ex-item" sm="3" lg="3">
						<div class="ex-item-title">
							{{getNameByKey('totalTransactions')}}
						</div>
						<div class="ex-item-value">
							{{storageInfo.numTransactions}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="3" lg="3">
						<div class="ex-item-title">
							{{getNameByKey('chainHeight')}}
						</div>
						<div class="ex-item-value">
							{{currentHeight}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="3" lg="3" :title="getNameByKey(votingNodeTooltips)">
						<div class="ex-item-title">
							{{ getNameByKey('finalizedHeight') }} ({{ getNameByKey(votingNodeText) }})
						</div>
						<div class="ex-item-value">
							{{finalizedHeight}}
						</div>
					</b-col>
					<b-col class="ex-item" sm="3" lg="3">
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
import { mapGetters } from 'vuex';

export default {
	components: {
		Card,
		ButtonMore
	},

	computed: {
		...mapGetters({
			chainInfo: 'chain/getChainInfo',
			storageInfo: 'chain/getStorageInfo',
			marketData: 'chain/getMarketData',
			nodeStats: 'chain/getNodeStats',
			loading: 'chain/getLoading'
		}),

		currentHeight() {
			return this.chainInfo.currentHeight;
		},

		finalizedHeight() {
			return this.chainInfo.finalizedBlockHeight;
		},

		votingNodeText() {
			return this.chainInfo.isVotingNode ? 'votingNode' : 'nonVotingNode';
		},

		votingNodeTooltips() {
			return this.chainInfo.isVotingNode ? 'votingNodeTooltips' : 'nonVotingNodeTooltips';
		},

		nodeCount() {
			return this.nodeStats?.total || '-';
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
.ex-item {
    border-left: 4px solid #904d9c;
    padding: 1px 10px;
    margin-bottom: 15px;

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
}
</style>
