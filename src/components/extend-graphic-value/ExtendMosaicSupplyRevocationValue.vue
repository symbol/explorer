<template>
	<div>
		<span
			v-if="hasMosaics"
			:title="getTranslation('mosaics')">
			<MosaicsCircle
				style="width: 16px; height: 16px;"
				id="target"
				:mosaics="[]"
			/>
		</span>
	</div>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';
import MosaicsCircle from '@/components/graphics/MosaicsCircle.vue';

export default {
	extends: GraphicComponent,

	components: {
		MosaicsCircle
	},

	props: {
		value: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},

	computed: {
		hasMosaics () {
			if (this.value.mosaics)
				return Array.isArray(this.value.mosaics) && 0 < this.value.mosaics.length;

			return false;
		}
	}
};
</script>
