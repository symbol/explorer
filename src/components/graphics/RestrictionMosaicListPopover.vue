<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<MosaicListItem
				v-for="(value, key) in addedRestriction"
				:key="'rmlp_' + key"
				:mosaic="value"
				:value="getTranslation('restrictionAdded')"
			/>

			<MosaicListItem
				v-for="(value, key) in removedRestriction"
				:key="'rmlp_' + key"
				:mosaic="value"
				:value="getTranslation('restrictionRemoved')"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';
import MosaicListItem from './MosaicListItem.vue';

export default {
	extends: GraphicComponent,

	components: {
		MosaicListItem
	},

	props: {
		data: {
			type: Object,
			default: () => ({})
		},

		title: {
			type: String,
			default: 'Table'
		},

		target: {
			type: String,
			required: true
		}
	},
	computed: {
		addedRestriction () {
			return this.data.added;
		},
		removedRestriction () {
			return this.data.removed;
		}
	},
	methods: {
		getTranslation (key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>
