<template>
	<b-dropdown
		:variant="variant"
		:text="selectedOptionLabel"
		:size="_size"
		:right="right"
	>
		<div v-for="(el, index) in options"
			class="ex-dropdown dropdown-filter"
			:key="'dropdown ' + index"
		>
			<b-dropdown-item
				@click="onChange(index)"
			>
				<span class="mdi" :class="{[el.icon]: true}"/> {{el.label}}
			</b-dropdown-item>

			<ExportCSVButton
				v-if="el.exportCSV && el.exportCSV.isActive"
				:filterOptions="el"
			/>
		</div>
	</b-dropdown>
</template>

<script>
import ExportCSVButton from './ExportCSVButton.vue';

export default {
	components: {
		ExportCSVButton
	},
	props: {
		options: {
			type: Array,
			default: () => []
		},

		index: {
			type: Number,
			default: 0
		},

		changePageAction: {
			type: String
		},

		dark: {
			type: Boolean,
			default: false
		},

		right: {
			type: Boolean,
			default: false
		},

		border: {
			type: Boolean,
			default: true
		},

		size: {
			type: String,
			default: 'small'
		}
	},

	computed: {
		variant () {
			let variant = '';

			variant = 'outline-';

			if (true === this.dark) {
				variant += 'dark-mode-blue';
			}
			else {
				variant += 'info';
			}

			if (false === this.border)
				variant += ' border-transparent';

			return variant;
		},

		_size () {
			switch (this.size) {
			case 'small': return 'sm';
			case 'medium': return '';
			case 'large': return 'lg';
			}
			return '';
		},

		selectedOptionLabel () {
			if (this.options && this.options[this.index] !== void 0)
				return this.options[this.index].label;
			return this.index;
		}
	},

	methods: {
		onChange (e) {
			this.$emit('change', e);
			if (this.changePageAction)
				this.$store.dispatch(this.changePageAction, e);
		}
	}
};
</script>

<style lang="scss">
.dropdown-toggle::after {
    vertical-align: middle;
}

.dropdown-filter {
    display: flex;
}
</style>
