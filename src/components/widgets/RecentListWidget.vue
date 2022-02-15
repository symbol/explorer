<template>
	<Card :loading="loading">
		<template #title>
			{{ getKeyName(title) }}
		</template>

		<template #control>
			<router-link :to="viewMoreLinkURL">
				<ButtonMore> {{getKeyName('viewAll')}} </ButtonMore>
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
						v-for="(item, index) in recentList"
						:key="`recent_${viewMoreLinkURL}_${index}_${item[headerField]}`"
					>
						<Card
							class='card-item'
							:item="item"
						>
							<template #header>
								<router-link
									:to="getItemHref(headerField, item[headerField])"
									class="ex-title-text"
									:title="getKeyName(headerField) + ': ' + item[headerField]"
								>
									{{ item[headerField] }}
								</router-link>
							</template>
							<template #body>
								<div class="ex-row no-wrap"
									v-for="(field, index) in fields"
									:key="`field_${index}_${item[field]}`">
									<div class="ex-text">
										{{ getKeyName(field) }}
									</div>

									<router-link
										v-if="isKeyClickable(field)"
										:to="getItemHref(field, item[field])"
										class="ex-long-text"
										:title="item[field]"
									>
										{{ item[field] }}
									</router-link>

									<div v-else class="ex-text">
										{{ item[field] }}
									</div>
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
import TableView from '@/components/tables/TableView.vue';

export default {
	extends: TableView,
	props: {
		title: {
			type: String,
			require: true
		},
		viewMoreLinkURL: {
			type: String,
			require: true
		},
		dataGetter: {
			type: String,
			require: true
		},
		headerField: {
			type: String,
			require: true
		},
		fields: {
			type: Array,
			require: true
		}
	},

	components: {
		Card,
		ButtonMore
	},

	computed: {
		recentList () {
			return this.$store.getters[this.dataGetter] || [];
		},

		loading () {
			return !this.recentList.length;
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
