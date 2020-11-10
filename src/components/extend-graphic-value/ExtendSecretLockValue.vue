<template>
	<span
		v-if="hasSecret"
		:title="getTranslation('secret') + ': ' + secret">
		{{ truncString(secret, 8) }}
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
		hasSecret() {
			for (const item of this.value) {
				if (Object.keys(item).includes('secret'))
					return typeof item.secret === 'string' && item.secret.length > 0;
			}
			return false;
		},

		secret() {
			for (const item of this.value) {
				if (Object.keys(item).includes('secret'))
					return item.secret;
			}
			return '';
		}
	}
};
</script>
