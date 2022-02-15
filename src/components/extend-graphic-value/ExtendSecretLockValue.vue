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
		hasSecret () {
			for (const item of this.value) {
				if (Object.keys(item).includes('secret'))
					return 'string' === typeof item.secret && 0 < item.secret.length;
			}

			return false;
		},

		secret () {
			for (const item of this.value) {
				if (Object.keys(item).includes('secret'))
					return item.secret;
			}

			return '';
		}
	}
};
</script>
