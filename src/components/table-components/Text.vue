<template>
	<div>
		{{formattedText}}
	</div>
</template>

<script>
import translate from '../../i18n';

export default {
    name: 'Text',

    props: {
		value: {
			type: String,
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
			return this.translate(this.languag, this.value);
		}
	}
};
</script>