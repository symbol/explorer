<template>
	<Card :loading="loading">
		<template #title>
			{{getNameByKey('recentBlocks')}}
		</template>

		<template #control>
			<router-link to="/blocks">
				<ButtonMore> {{getNameByKey('viewAllBlocks')}} </ButtonMore>
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
						v-for="(item, index) in blockList"
						:key="'recent_blocks_'+index+'_'+item.height"
					>
						<Card
							class='card-item'
							:item="item"
						>
							<template #header>
								<router-link
									:to="'/blocks/'+item.height"
									class="ex-title-text"
									:title="getNameByKey('blockHeight') + ': ' + item.height"
								>
									{{item.height}}
								</router-link>
							</template>
							<template #body>
								<div class="ex-row">
									<div class="ex-text">
										{{ getNameByKey('created') }}
									</div>
									<div class="ex-text">
										<Age :date="item.age"/>
									</div>
								</div>
								<div class="ex-row no-wrap">
									<div class="ex-text">
										{{getNameByKey('harvester')}}
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
			blockList: 'block/getRecentList'
		}),

		loading () {
			return !this.blockList.length;
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

        .ex-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .ex-text {
                font-size: 10px;
                color: #acacac;
            }

            .ex-long-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
        }
    }
}
</style>
