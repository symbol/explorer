<template>
	<Card class="card-f" :loading="loading" :error="error">
		<template #title>
			{{getNameByKey(title)}}
		</template>

		<template #control>
			<DropdownFilter
				:dark="true"
				v-if="hasFilter"
				:options="filterOptions"
				:value="filterValue"
				:index="filterIndex"
				right
				@change="changeFilterValue"
			/>
		</template>

		<template #body>
			<b-row class="map-container">
				<b-col class="map map-width-limit" :style="{'max-width': maxWidth+'px'}">
					<NodesMap
						:nodes="nodeList"
						:height="height"
						:zoom="zoom"
						:minZoom="minZoom"
						:showPopup="showPopup"
					/>
				</b-col>
			</b-row>
			<b-row class="map-legend">
				<div class="legend-filter">
					<DropdownFilter
						:dark="false"
						:border="false"
						v-if="hasFilter"
						:options="filterOptions"
						:value="filterValue"
						:index="filterIndex"
						right
						@change="changeFilterValue"
					/>
				</div>

				<div class="legend-item-container">
					<div class="legend-item" v-for="(item, index) in mapLegends" :key="'legend_'+index">
						<img :src="item.iconUrl" class="legend-logo">
						{{ getNodeRoleName(item.rolesRaw) }} ({{ item.count }})
					</div>
				</div>
			</b-row>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import NodesMap from '@/components/NodesMap.vue';
import DropdownFilter from '@/components/controls/DropdownFilter.vue';
import IconApiVoter from '../../styles/img/pin-api-voter.png';
import IconApi from '../../styles/img/pin-api.png';
import IconPeerApiVoter from '../../styles/img/pin-peer-api-voter.png';
import IconPeerApi from '../../styles/img/pin-peer-api.png';
import IconPeerVoter from '../../styles/img/pin-peer-voter.png';
import IconPeer from '../../styles/img/pin-peer.png';
import IconVoter from '../../styles/img/pin-voter.png';
import Constants from '../../config/constants';

export default {
	components: {
		Card,
		NodesMap,
		DropdownFilter
	},

	props: {
		height: {
			default: 400
		},
		maxWidth: {
			default: 400
		},
		zoom: {
			type: Number,
			default: 1
		},
		minZoom: {
			type: Number,
			default: 1
		},
		title: {
			type: String,
			default: 'nodes'
		},
		showPopup: {
			type: Boolean,
			default: true
		},
		// Data Manager getter (DataSet, Timeline, Filter)
		managerGetter: {
			type: String
		},
		// Object or Array. If not provided, will use data from Data Manager
		dataGetter: {
			type: String
		},
		// Adds dropdown for Filter Data Manager
		hasFilter: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		manager() {
			return this.getter(this.managerGetter) || {};
		},

		data() {
			return this.getter(this.dataGetter) || this.manager.data;
		},

		loading() {
			return this.manager.loading;
		},

		error() {
			return this.manager.error;
		},

		nodeList() {
			return this.data || [];
		},

		filterValue() {
			return this.manager.filterValue;
		},

		filterIndex() {
			return this.manager.filterIndex;
		},

		filterOptions() {
			return this.manager.filterOptions;
		},

		getRolesCounter() {
			const rolesCounter = {
				peer: 0,
				apiVoter: 0,
				api: 0,
				peerApiVoter: 0,
				peerApi: 0,
				peerVoter: 0,
				voter: 0
			};

			if (this.nodeList.length !== 0) {
				this.nodeList.forEach(node => {
					if (node.rolesRaw === Constants.ROLE_TYPE_RAW.PEER)
						rolesCounter.peer++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.API)
						rolesCounter.api++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.PEER_API)
						rolesCounter.peerApi++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.VOTER)
						rolesCounter.voter++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.PEER_VOTER)
						rolesCounter.peerVoter++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.API_VOTER)
						rolesCounter.apiVoter++;
					else if (node.rolesRaw === Constants.ROLE_TYPE_RAW.PEER_API_VOTER)
						rolesCounter.peerApiVoter++;
				});
			}

			return rolesCounter;
		},

		mapLegends() {
			const rolesCounter = this.getRolesCounter;

			const legends = [{
				rolesRaw: Constants.ROLE_TYPE_RAW.PEER,
				iconUrl: IconPeer,
				count: rolesCounter.peer
			},
			{
				rolesRaw: Constants.ROLE_TYPE_RAW.API,
				iconUrl: IconApi,
				count: rolesCounter.api
			}, {
				rolesRaw: Constants.ROLE_TYPE_RAW.VOTER,
				iconUrl: IconVoter,
				count: rolesCounter.voter
			}, {
				rolesRaw: Constants.ROLE_TYPE_RAW.PEER_VOTER,
				iconUrl: IconPeerVoter,
				count: rolesCounter.peerVoter
			}, {
				rolesRaw: Constants.ROLE_TYPE_RAW.API_VOTER,
				iconUrl: IconApiVoter,
				count: rolesCounter.apiVoter
			}, {
				rolesRaw: Constants.ROLE_TYPE_RAW.PEER_API,
				iconUrl: IconPeerApi,
				count: rolesCounter.peerApi
			}, {
				rolesRaw: Constants.ROLE_TYPE_RAW.PEER_API_VOTER,
				iconUrl: IconPeerApiVoter,
				count: rolesCounter.peerApiVoter
			}];

			return this.filterIndex === 0 ? legends : legends.filter(legend => legend.rolesRaw === this.filterIndex);
		}
	},

	methods: {
		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter(name) {
			return this.$store.getters[name];
		},

		changeFilterValue(e) {
			if (typeof this.manager.changeFilterValue === 'function')
				this.manager.changeFilterValue(e);
			else {
				console.error(
					'Failed to change filter value. "changeFilterValue" is not a function'
				);
			}
		},

		getNodeRoleName(rolesRaw) {
			return Constants.RoleType[rolesRaw].replaceAll(' ', ' + ');
		}
	}
};
</script>

<style lang="scss" scoped>
.map-width-limit {
    min-width: 500px;
}

@media (max-width: 764px) {
    .map-width-limit {
        min-width: 250px;
    }
}

.map-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.map {
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 10px 20px;
}

.map-legend {
    margin: auto;
    border-radius: 3px;
    background-color: #e8e8e8;
    width: 90%;
    height: 40px;
    align-items: center;
    font-size: 12px;
    font-weight: bold;

    .legend-logo {
        width: 25px;
    }

    .legend-filter {
        align-items: center;
        padding: 0 15px;
        margin: 0 10px;
        border-right: black solid 2px;
    }

    .legend-item-container {
        width: 80%;
        display: flex;
        justify-content: space-between;

        .legend-item {
            padding: 0 10px;
        }
    }
}
</style>
