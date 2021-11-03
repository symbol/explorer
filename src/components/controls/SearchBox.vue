<template>
	<b-form-input
		v-model="searchString"
		:class="{'is-invalid': isError}"
		class="bg-transparent"
		size="sm"
		:placeholder="getNameByKey(placeholder)"
		:disabled="isLoading"
		@change="onSearch"
	>
	</b-form-input>
</template>

<script>
export default {
	mounted() {
		this.isLoading = false;
	},

	data() {
		return {
			searchString: '',
			searchValidate: '',
			isError: false,
			isLoading: false,
			placeholder: 'searchBoxPlaceholder'
		};
	},

	computed: {},

	methods: {
		onSearch() {
			this.isLoading = true;
			this.$store
				.dispatch('ui/search', this.searchString)
				.then(() => {
					this.isLoading = false;
					return (this.searchString = '');
				})
				.catch(e => {
					this.isLoading = false;
					this.fail(e);
				});
		},

		fail(e) {
			if (e.message === 'errorNisAddressNotAllowed')
				alert(this.getNameByKey(e.message));

			this.searchString = this.getNameByKey('errorNothingFound');
			this.isError = true;
			setTimeout(() => {
				this.isError = false;
				this.searchString = '';
			}, 1000);
		},

		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.form-control {
	border-color: $dark-mode-button-text-color !important;
    color: $dark-mode-button-text-color !important;
    font-size: 12px;
	text-transform: uppercase !important;
}

.form-control:focus {
	border-color: $dark-mode-button-text-color;
    color: $dark-mode-button-text-color !important;
}

.form-control::-webkit-input-placeholder {
    color: $dark-mode-button-text-color;
    font-size: 12px;
}

.transition {
    -webkit-transition: color 0.2s ease-out;
    -moz-transition: color 0.2s ease-out;
    -o-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
}
</style>
