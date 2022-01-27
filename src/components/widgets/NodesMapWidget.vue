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
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import NodesMap from '@/components/NodesMap.vue';
import DropdownFilter from '@/components/controls/DropdownFilter.vue';

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
		manager () {
			return this.getter(this.managerGetter) || {};
		},

		data () {
			return this.getter(this.dataGetter) || this.manager.data;
		},

		loading () {
			return this.manager.loading;
		},

		error () {
			return this.manager.error;
		},

		nodeList () {
			return this.data || [];
		},

		filterValue () {
			return this.manager.filterValue;
		},

		filterIndex () {
			return this.manager.filterIndex;
		},

		filterOptions () {
			return this.manager.filterOptions;
		}
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getter (name) {
			return this.$store.getters[name];
		},

		changeFilterValue (e) {
			if ('function' === typeof this.manager.changeFilterValue) {
				this.manager.changeFilterValue(e);
			} else {
				console.error('Failed to change filter value. "changeFilterValue" is not a function');
			}
		}
	}
};
</script>

<style scoped>
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
</style>
