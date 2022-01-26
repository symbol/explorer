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
		hasProof () {
			for (const item of this.value) {
				if (Object.keys(item).includes('proof'))
					return 'string' === typeof item.proof && 0 < item.proof.length;
			}

			return false;
		},

		proof () {
			for (const item of this.value) {
				if (Object.keys(item).includes('proof'))
					return item.proof;
			}

			return '';
		}
	}
};
</script>
