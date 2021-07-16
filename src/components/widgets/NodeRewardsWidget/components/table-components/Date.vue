<template>
	<div>
		{{formattedDate}}
	</div>
</template>

<script>
import * as utils from '../../utils';

export default {
	name: 'Date',

	props: {
		value: {
			type: String,
			required: true
		},
		keyName: {
			type: String,
			default: ''
		},
		language: {
			type: String
		}
	},

	computed: {
		containsTime() {
			return this.keyName.toUpperCase().includes('TIME') ||
            this.keyName.toUpperCase().includes('AT');
		},

		formattedDate() {
			return utils.formatDate(this.value, this.language, this.containsTime);
		}
	}
};
</script>
