<template>
	<span
		v-if="hasAction"
		:title="getTranslation('actionType') + ': ' + getTranslation(action)">
		{{ getTranslation(action) }}
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
		hasAction () {
			for (const item of this.value) {
				if (Object.keys(item).includes('action'))
					return 'string' === typeof item.action;
			}

			return false;
		},

		action () {
			for (const item of this.value) {
				if (Object.keys(item).includes('action'))
					return item.action;
			}

			return '';
		}
	}
};
</script>
