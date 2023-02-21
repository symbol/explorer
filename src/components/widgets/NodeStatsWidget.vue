<template>
	<Card v-if="!error && this.data" :loading="loading" style="width: 100%;">
		<template #title>
			{{getNameByKey('nodeStatsTitle')}}
		</template>

		<template #control>
			<router-link to="/statistics">
				<ButtonMore> {{getNameByKey('viewMoreStatistics')}} </ButtonMore>
			</router-link>
		</template>

		<template #body>
			<b-container fluid style="height: 100%;">
				<b-row>
					<b-col
						v-for="(item, index) in nodeRoles"
						:key="'' + index + 'nodestats_roles'"
						class="ex-item"
						xs="2"
						sm="3"
						lg="3"
					>
						<div class="ex-item-title">
							{{item.name}}
						</div>
						<div class="ex-item-value">
							{{item.count}}
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
import Constants from '../../config/constants';

export default {
	components: {
		Card,
		ButtonMore
	},

	props: {
		managerGetter: {
			type: String
		},
		dataGetter: {
			type: String
		}
	},

	computed: {
		manager () {
			return this.getter(this.managerGetter) || {};
		},

		data () {
			return this.dataGetter
				? this.getter(this.dataGetter)
				: this.manager.data;
		},

		nodeRoles () {
			const data = this.data;

			if (!data)
				return [];

			return [
				{
					name: this.getNameByKey('allNodes'),
					count: Array.from(Array(8).keys()).reduce((acc, val) => acc + (data[val] || 0))
				},
				{
					name: Constants.RoleType[1],
					count: data[1] || 0
				},
				{
					name: Constants.RoleType[2],
					count: data[2] || 0
				},
				{
					name: Constants.RoleType[3],
					count: data[3] || 0
				},
				{
					name: Constants.RoleType[4],
					count: data[4] || 0
				},
				{
					name: Constants.RoleType[5],
					count: data[5] || 0
				},
				{
					name: Constants.RoleType[6],
					count: data[6] || 0
				},
				{
					name: Constants.RoleType[7],
					count: data[7] || 0
				}
			];
		},

		loading () {
			return this.manager.loading;
		},

		error () {
			return this.manager.error;
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter (name) {
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
        padding: 1px 10px;
        margin-bottom: 15px;
        max-width: 150px;
    }
}

.ex-item {
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

.blue {
    border-color: $blue-color;
}

.pink {
    border-color: $pink-color;
}

.green {
    border-color: var(--balance-green-text);
}

.orange {
    border-color: $orange-color;
}
</style>
