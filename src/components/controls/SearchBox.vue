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
	mounted () {
		this.isLoading = false;
	},

	data () {
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
		onSearch () {
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

		fail (e) {
			if ('errorNisAddressNotAllowed' === e.message)
				alert(this.getNameByKey(e.message));

			this.searchString = this.getNameByKey('errorNothingFound');
			this.isError = true;
			setTimeout(() => {
				this.isError = false;
				this.searchString = '';
			}, 1000);
		},

		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.form-control {
    border-color: var(--clickable-text) !important;
    color: var(--clickable-text) !important;
    font-size: 12px;
    text-transform: uppercase !important;
}

.form-control:focus {
    border-color: var(--clickable-text);
    color: var(--clickable-text) !important;
}

.form-control::-webkit-input-placeholder {
    color: var(--clickable-text);
    font-size: 12px;
}

.transition {
    -webkit-transition: color 0.2s ease-out;
    -moz-transition: color 0.2s ease-out;
    -o-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
}
</style>
