<template>
	<span
		v-if="hasReferenceMosaicId"
		:title="getTranslation('referenceMosaicId') + ': ' + referenceMosaicId"
		style="display: flex;"
	>
		<MosaicIcon
			hideCaption
			:width="16"
			:height="16"
			:mosaicId="referenceMosaicId"
		/>

		{{ truncString(referenceMosaicId) }}
	</span>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';
import MosaicIcon from '@/components/graphics/MosaicIcon.vue';

export default {
	extends: GraphicComponent,

	components: {
		MosaicIcon
	},

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasReferenceMosaicId () {
			for (const item of this.value) {
				if (Object.keys(item).includes('referenceMosaicId'))
					return 'string' === typeof item.referenceMosaicId;
			}

			return false;
		},

		referenceMosaicId () {
			for (const item of this.value) {
				if (Object.keys(item).includes('referenceMosaicId'))
					return item.referenceMosaicId;
			}

			return 'N/A';
		}
	}

};
</script>

<style lang="scss" scoped>
.restrictionItem {
    display: flex;
    flex-wrap: wrap;
}
</style>
