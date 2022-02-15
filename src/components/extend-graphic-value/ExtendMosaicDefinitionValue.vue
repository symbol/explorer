<template>
	<span
		v-if="hasMosaicId"
		:title="getTranslation('mosaicId') + ': ' + mosaicId"
		style="word-break: keep-all; display: flex;"
	>
		<MosaicIcon
			hideCaption
			style="margin-right: 5px;"
			:width="16"
			:height="16"
			:mosaicId="mosaicId"
		/>

		{{ truncString(mosaicId) }}
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
		hasMosaicId () {
			for (const item of this.value) {
				if (Object.keys(item).includes('mosaicId'))
					return 'string' === typeof item.mosaicId;
			}

			return false;
		},

		mosaicId () {
			for (const item of this.value) {
				if (Object.keys(item).includes('mosaicId'))
					return item.mosaicId;
			}

			return '';
		}
	}
};
</script>
