<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<MosaicListItem
				v-for="(mosaic, index) in mosaics"
				:key="'mlp'+mosaic.mosaicId + index"
				:mosaic="mosaic"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import MosaicListItem from '../graphics/MosaicListItem.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		MosaicListItem
	},

	props: {
		mosaics: {
			type: Array,
			default: () => []
		},

		title: {
			type: String,
			default: 'Mosaics'
		},

		target: {
			type: String,
			required: true
		}
	},

	methods: {
		click () {
			this.$emit('click', this.mosaicId);
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item {
    background-color: var(--sub-card-bg);
    border: 1px solid var(--sub-card-border);
    color: var(--text-color);
    min-width: 250px;
}
</style>
