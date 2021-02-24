<template>
	<div class="pagination-wrapper">
		<LoadingAnimation v-if="isLoading" transition="fade" />
		<div v-else-if="canFetchNext" class="pagination-button" @click="nextPage">
			{{ buttonText }}
		</div>
		<div v-if="text" class="caption">
			{{ text }}
		</div>
	</div>
</template>

<script>
import translate from '../i18n';
import LoadingAnimation from './LoadingAnimation.vue';

export default {
	components: {
		LoadingAnimation
	},

	props: {
		canFetchNext: {
			type: Boolean,
			required: true,
			default: true
		},

		isLoading: {
			type: Boolean,
			required: true,
			default: true
		},

		isError: {
			type: Boolean,
			required: true,
			default: true
		},

		isEmpty: {
			type: Boolean,
			required: true,
			default: true
		}
	},

	computed: {
		buttonText() {
			if (this.isError)
				return translate(this.language, 'buttonTryAgain');
			else if (this.canFetchNext && !this.isEmpty)
				return translate(this.language, 'buttonMore');

			return null;
		},

		text() {
			if (!this.isLoading && this.isEmpty && !this.isError)
				return translate(this.language, 'nothingToShow');

			return null;
		}
	},

	methods: {
		nextPage() {
			if (this.canFetchNext)
				this.$emit('next');
		}
	}
};
</script>

<style lang="scss" scoped>
.pagination-wrapper {
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 40px;
}

.pagination-button {
    text-align: center;
    width: 100%;
    color: #f0f;
    font-size: 10px;
    cursor: pointer;
}

.caption {
    text-align: center;
    width: 100%;
    font-size: 10px;
    opacity: 0.5;
}
</style>
