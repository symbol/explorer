<template>
	<span
		v-if="hasLinkAction"
		:title="getTranslation('linkAction') + ': ' + getTranslation(linkAction)">
		{{ getTranslation(linkAction) }}
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
		hasLinkAction () {
			for (const item of this.value) {
				if (Object.keys(item).includes('linkAction'))
					return 'string' === typeof item.linkAction && 0 < item.linkAction.length;
			}

			return false;
		},

		linkAction () {
			for (const item of this.value) {
				if (Object.keys(item).includes('linkAction'))
					return item.linkAction;
			}

			return '';
		}
	}

};
</script>
