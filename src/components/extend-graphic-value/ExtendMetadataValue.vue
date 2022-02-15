<template>
	<span
		v-if="hasMetadataValue"
		:title="getTranslation('metadataValue') + ': ' + metadataValue">
		{{ getTranslation(metadataValue) }}
	</span>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasMetadataValue () {
			for (const item of this.value) {
				if (Object.keys(item).includes('metadataValue'))
					return 'string' === typeof item.metadataValue && 0 < item.metadataValue.length;
			}

			return false;
		},

		metadataValue () {
			for (const item of this.value) {
				if (Object.keys(item).includes('metadataValue'))
					return item.metadataValue;
			}

			return '';
		}
	}

};
</script>
