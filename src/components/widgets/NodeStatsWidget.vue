<template>
	<Card v-if="!error && this.data" :loading="loading" style="width: 100%">
		<template #title>
			{{getNameByKey('nodeStatsTitle')}}
		</template>

		<template #control>
			<router-link to="/statistics">
				<ButtonMore> {{getNameByKey('viewMoreStatistics')}} </ButtonMore>
			</router-link>
		</template>

		<template #body>
			<b-container fluid style="height: 100%">
				<b-row class="ex-ns-group">
					{{getNameByKey('nodeCountByRoles')}}
				</b-row>
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
				<b-row v-if="!!nodePrograms.length" class="ex-ns-group">
					{{getNameByKey('rewardPrograms')}}
				</b-row>
				<b-row>
					<b-col
						v-for="(item, index) in nodePrograms"
						:key="'' + index + 'nodestats_programs'"
						xs="2"
						sm="3"
						lg="3"
					>
						<b-row class="ex-item item-noborder">
							<img :src="item.icon" class="node-program-icon"/>
							<b-col>
								<div class="ex-item-title ex-text-break">
									{{item.name}}
								</div>
								<div class="ex-item-value">
									{{item.count}}
								</div>
							</b-col>
						</b-row>
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
import IconOrange from '../../styles/img/connector_orange.png';
import IconBlue from '../../styles/img/connector_blue.png';
import IconGreen from '../../styles/img/connector_green.png';
import IconPink from '../../styles/img/connector_pink.png';
import IconSupernode from '../../styles/img/node_reputation.png';

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
		manager() {
			return this.getter(this.managerGetter) || {};
		},

		data() {
			return this.dataGetter
				? this.getter(this.dataGetter)
				: this.manager.data;
		},

		nodeRoles() {
			const data = this.data?.nodeTypes;

			if (!data)
				return [];

			return [
				{
					name: this.getNameByKey('allNodes'),
					count: Array.from(Array(8).keys()).reduce((acc, val) => acc + (data[val] || 0)),
					icon: IconBlue
				},
				{
					name: Constants.RoleType[1],
					count: data[1] || 0,
					icon: IconBlue,
					color: 'blue'
				},
				{
					name: Constants.RoleType[2],
					count: data[2] || 0,
					icon: IconPink,
					color: 'pink'
				},
				{
					name: Constants.RoleType[3],
					count: data[3] || 0,
					icon: IconPink,
					color: 'pink'
				},
				{
					name: Constants.RoleType[4],
					count: data[4] || 0,
					icon: IconGreen,
					color: 'green'
				},
				{
					name: Constants.RoleType[5],
					count: data[5] || 0,
					icon: IconGreen,
					color: 'green'
				},
				{
					name: Constants.RoleType[6],
					count: data[6] || 0,
					icon: IconOrange,
					color: 'orange'
				},
				{
					name: Constants.RoleType[7],
					count: data[7] || 0,
					icon: IconOrange,
					color: 'orange'
				}
			];
		},

		nodePrograms() {
			const data = this.data?.nodeTypes;

			if (!data)
				return [];

			return Object
				.keys(data)
				.filter((key) => !Number(key))
				.map(key => ({
					name: key,
					count: data[key],
					icon: IconSupernode
				}));
		},

		loading() {
			return this.manager.loading;
		},

		error() {
			return this.manager.error;
		}
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter(name) {
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
        border-left: 4px solid #904d9c;
        padding: 1px 10px;
        margin-bottom: 15px;
        max-width: 150px;
    }
}

.ex-item {
    border-left: 4px solid #904d9c;
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

.node-program-icon {
    height: 32px;
    margin: auto 0;
}

.blue {
    border-color: $blue-color;
}

.pink {
    border-color: $pink-color;
}

.green {
    border-color: $green-color;
}

.orange {
    border-color: $orange-color;
}
</style>
