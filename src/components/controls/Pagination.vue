<template>
	<div class="pagination-wrapper">
		<div>
			<b-button-group>
				<b-button v-if="advance" variant="outline-info" size="sm" @click="goFirstPage" :class="{'disabled': isFirstPageDisable}" >
					{{ getNameByKey('First') }}
				</b-button>
				<b-button variant="outline-info" size="sm" @click="previousPage" :class="{'disabled': !canFetchPrevious}">
					<IconArrowLeft />
				</b-button>

				<div v-if="advance" class="pageNumberHolder">
					<input v-model="pageNumber" @keyup.enter="fetchPage"> of {{ lastPageNumber }}
				</div>

				<b-button variant="outline-info" size="sm" @click="nextPage" :class="{'disabled': !canFetchNext}">
					<IconArrowRight />
				</b-button>

				<b-button v-if="advance" variant="outline-info" size="sm" @click="goLastPage" :class="{'disabled': isLastPageDisable}">
					{{ getNameByKey('Last') }}
				</b-button>
			</b-button-group>
		</div>
	</div>
</template>

<script>
import IconArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
import IconArrowRight from 'vue-material-design-icons/ArrowRight.vue';

export default {
	components: {
		IconArrowLeft,
		IconArrowRight
	},

	props: {
		advance: {
			type: Boolean,
			required: false,
			default: true
		},

		canFetchPrevious: {
			type: Boolean,
			required: true
		},

		canFetchNext: {
			type: Boolean,
			required: true
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
		},

		lastPageNumber: {
			type: [Number, String],
			required: false,
			default: '..'
		},

		currentPageNumber: {
			type: Number,
			required: false,
			default: 1
		}
	},

	data() {
		return {
			pageNumber: this.currentPageNumber
		};
	},

	computed: {
		isFirstPageDisable() {
			return this.currentPageNumber === 1;
		},
		isLastPageDisable() {
			return this.currentPageNumber === this.lastPageNumber || this.lastPageNumber === '..';
		}
	},

	methods: {
		nextPage() {
			if (this.nextPageAction)
				this.$store.dispatch(this.nextPageAction);

			this.$emit('next');
			if (this.goUp)
				this.goToTop();
		},

		previousPage() {
			if (this.previousPageAction)
				this.$store.dispatch(this.previousPageAction);
			this.$emit('previous');
			if (this.goUp)
				this.goToTop();
		},

		goFirstPage() {
			this.$emit('firstPage');
			if (this.goUp)
				this.goToTop();
		},

		goLastPage() {
			this.$emit('lastPage');
			if (this.goUp)
				this.goToTop();
		},

		fetchPage() {
			this.$emit('fetchPage', this.pageNumber);

			if (this.goUp)
				this.goToTop();
		},

		goToTop() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		},

		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.pageNumberHolder {
	padding: 1px 5px;

	input {
		border: solid 1px var(--clickable-text);
		color: var(--clickable-text);
		background-color: transparent;
		width: 80px;
		text-align: center;
	}

}

.disabled {
    cursor: not-allowed;
    color: var(--clickable-text);
}

.page-item {
    cursor: pointer;
}

.pagination-wrapper {
    float: right;

    .btn-outline-info {
		margin: 0px 3px;
        color: var(--clickable-text);
        border-color: var(--clickable-text);
    }

    .btn-outline-info:hover {
        color: var(--text-color);
        background-color: var(--clickable-text);
    }

    .pagination-arrow {
        justify-content: center;
        flex-direction: column;
        display: flex;
        height: 22px;
    }
}
</style>
