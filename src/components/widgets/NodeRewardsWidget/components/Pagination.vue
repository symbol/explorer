<template>
	<div class="pagination-wrapper">
		<img
			class="pg-icon"
			:class="{'pg-icon-disabled': !canFetchPrevious}"
			:src="IconBack"
			@click="previousPage"
		/>
		<div class="pg-number">
			{{ pageNumber }}
		</div>
		<img
			class="pg-icon"
			:class="{'pg-icon-disabled': !canFetchNext}"
			:src="IconNext"
			@click="nextPage"
		/>
	</div>
</template>

<script>
import IconBack from '../assets/back.png';
import IconNext from '../assets/next.png';

export default {
	props: {
		pageNumber: {
			type: Number,
			required: false,
			default: 1
		},

		canFetchPrevious: {
			type: Boolean,
			required: true,
			default: false
		},

		canFetchNext: {
			type: Boolean,
			required: true,
			default: true
		},

		nextPageAction: {
			type: String,
			required: false
		},

		previousPageAction: {
			type: String,
			required: false
		},

		goUp: {
			type: Boolean,
			required: false,
			default: true
		}
	},

	data() {
		return {
			IconBack,
			IconNext
		};
	},

	methods: {
		nextPage() {
			if (this.nextPageAction)
				this.$store.dispatch(this.nextPageAction);
			if (this.canFetchNext)
				this.$emit('next');
		},

		previousPage() {
			if (this.previousPageAction)
				this.$store.dispatch(this.previousPageAction);
			if (this.canFetchPrevious)
				this.$emit('previous');
		}
	}
};
</script>

<style lang="scss" scoped>
.pagination-wrapper {
    float: right;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    display: flex;
}

.pg-icon-disabled {
    cursor: not-allowed;
    filter: saturate(0.4);
    opacity: 0.6;
}

.pg-icon {
    cursor: pointer;
    height: 16px;
    margin: 5px;
}

.pg-number {
    font-size: 12px;
}
</style>
