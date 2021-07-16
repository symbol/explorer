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
		keyName: {
			type: String
		},
		value: {
			type: [String, Number],
			required: true
		},
		language: {
			type: String
		}
	},

	data() {
		return {
			translate
		};
	},

	computed: {
		formattedText() {
			if (Array.isArray(this.value)) {
				return this.translate(this.language, `value_${this.keyName}_item`, {
					value: ('[ ' + this.value.join(', ') + ' ]')
						.replace(/['"]+/g, '')
				});
			}

			if (this.value === -1)
				return this.translate(this.language, 'na');

			if (this.keyName && this.keyName.length)
				return this.translate(this.language, `value_${this.keyName}`, { value: this.value });

			return this.translate(this.language, this.value);
		}
	}
};
</script>
