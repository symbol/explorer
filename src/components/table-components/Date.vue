<template>
	<div>
		{{formattedDate}}
	</div>
</template>

<script>
import * as utils from '../../unils';

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
            type: String,
        }
	},

	computed: {
		containsTime() {
			console.log(this.keyName)
			return this.keyName.toUpperCase().includes('TIME');
		},

		formattedDate() {
			return utils.formatDate(this.value, this.language, this.containsTime);
		}
	},
};
</script>