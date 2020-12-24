<template>
	<img :src="imageSrc" class="boolean-image" />
</template>

<script>
import TrueIcon from '../../assets/true.png';
import FalseIcon from '../../assets/false.png';

export default {
    name: 'Boolean',

    props: {
		value: {
			type: Boolean,
			required: true
		}
	},

	computed: {
		passedImageSrc() {
			return this.value === true
				? TrueIcon
				: FalseIcon;
		}
	}
};
</script>

<style lang="scss" scoped>
.boolean-image {
	height: 16px;
}
</style>