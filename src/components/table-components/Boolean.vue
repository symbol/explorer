<template>
	<img :src="imageSrc" class="boolean-image" />
</template>

<script>
import translate from '../../i18n';
import TrueIcon from '../../assets/true.png';
import FalseIcon from '../../assets/false.png';

export default {
    name: "Modal",

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