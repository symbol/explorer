<template>
	<Card :loading="loading">
		<template #title>
			{{getNameByKey('recentTransactions')}}
		</template>

		<template #control>
			<router-link to="/transactions">
				<ButtonMore> {{getNameByKey('viewAllTransactions')}} </ButtonMore>
			</router-link>
		</template>

		<template #body>
			<b-container fluid>
				<b-row>
					<b-col
						sm="6"
						md="3"
						lg="6"
						xl="12"
						v-for="(item, index) in transactionList"
						:key="'recent_blocks_'+index+'_'+item.height"
					>
						<Card
							class="card-item"
							:item="item"
						>
							<template #header>
								<router-link
									:to="'/transactions/'+item.transactionHash"
									class="ex-title-text ex-long-text"
									:title="'Transaction hash: ' + item.transactionHash"
								>
									{{item.transactionHash}}
								</router-link>
							</template>
							<template #body>
								<div class="ex-row no-wrap">
									<div class="ex-text">
										{{getNameByKey('block')}}: {{ item.height }}
									</div>
									<div class="ex-long-text ex-text" :title="'Type: ' + item.type" style="margin-left: 20px;">
										<TransactionType :value="item.type" size="small" />
									</div>
								</div>
								<div class="ex-row no-wrap">
									<div class="ex-text">
										{{getNameByKey('sender')}}
									</div>
									<router-link
										:to="'/accounts/'+item.signer"
										class="ex-long-text ex-account-text"
										:title="item.signer"
									>
										{{item.signer}}
									</router-link>
								</div>
							</template>
						</Card>
					</b-col>
				</b-row>
			</b-container>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import ButtonMore from '@/components/controls/ButtonMore.vue';
import TransactionType from '@/components/fields/TransactionType.vue';
import { mapGetters } from 'vuex';

export default {
	components: {
		Card,
		ButtonMore,
		TransactionType
	},

	computed: {
		...mapGetters({
			transactionList: 'transaction/getRecentList'
		}),

		loading () {
			return !this.transactionList.length;
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
.ex-card .card-item {
    border: 1px solid var(--sub-card-border);
    background-color: var(--sub-card-bg);
}

.card-item {
    .card-body {
        padding: 0;

        .ex-title-text {
            color: var(--text-color);
        }

        .ex-long-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ex-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .ex-text {
                font-size: 10px;
                color: #acacac;
            }

            .ex-account-text {
                color: var(--clickable-text);
                font-weight: 600;
                font-size: 10px;
                margin-left: 20px;
            }
        }

        .no-wrap {
            flex-wrap: nowrap;
            white-space: nowrap;
        }
    }
}
</style>
