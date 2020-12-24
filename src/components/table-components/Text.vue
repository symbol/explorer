<template>
	<div>
		{{formattedText}}
	</div>
</template>

<script>
import translate from '../../i18n';

export default {
	name: 'TextField',

	props: {
		value: {
			type: [String, Number],
			required: true
		},
		language: {
			type: String,
		}
	},

	data() {
		return {
			translate
		}
	},

	computed: {
		formattedText() {
			return this.translate(this.language, this.value);
		}
	}
};
</script>