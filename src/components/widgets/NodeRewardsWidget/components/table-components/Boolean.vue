<template>
	<img v-if="isIcon" :src="imageSrc" class="boolean-image" />
	<div v-else>
		{{value}}
	</div>
</template>

<script>
import TrueIcon from '../../assets/true.png';
import FalseIcon from '../../assets/false.png';

export default {
	name: 'Boolean',

	props: {
		value: {
			type: [Boolean, String],
			required: true
		}
	},

	computed: {
		imageSrc() {
			return this.value === true ||
                this.value === 'SUCCEEDED'
				? TrueIcon
				: FalseIcon;
		},

		isIcon() {
			return typeof this.value === 'boolean' ||
                this.value === 'SUCCEEDED' ||
                this.value === 'FAILED';
		}
	}
};
</script>

<style lang="scss" scoped>
.boolean-image {
    width: 14px;
}
</style>
