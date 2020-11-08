<template>
	<span
		v-if="hasProof"
		:title="getTranslation('proof') + ': ' + proof">
		{{ truncString(proof, 8) }}
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
		hasProof() {
			for (const item of this.value) {
				if (Object.keys(item).includes('proof'))
					return typeof item.proof === 'string' && item.proof.length > 0;
			}
			return false;
		},

		proof() {
			for (const item of this.value) {
				if (Object.keys(item).includes('proof'))
					return item.proof;
			}
			return '';
		}
	}
};
</script>
