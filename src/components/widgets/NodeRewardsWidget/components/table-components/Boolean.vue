<template>
	<img v-if="isIcon" :src="imageSrc" :class="styleClass" />
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
		},

		small: {
			type: Boolean,
			default: false
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
		},

		styleClass() {
			return this.small ? 'boolean-image-small' : 'boolean-image';
		}
	}
};
</script>

<style lang="scss" scoped>
.boolean-image {
    width: 14px;
}

.boolean-image-small {
    width: 7px;
}
</style>
