<template>
	<div class="main-root">
		<div>{{data.nodeName}}</div>
		<div>{{translate(language, 'roundNumber', {number: data.roundNumber})}}</div>
		<div>{{formatDate(data.testDate)}}</div>
		<History :data="data.history" :language="language" class="history" />
	</div>
</template>

<script>
import * as utils from '../unils';
import translate from '../i18n';
import History from './History.vue';

export default {
	name: 'Main',

	components: { History },

	props: {
		data: {
			type: Object,
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

	methods: {
		formatDate(date) {
			return utils.formatDate(date, this.language)
		}
	}
}
</script>

<style lang="scss" scoped>
.main-root {
	background: transparent;
	position: relative;

	.history {
		max-width: 500px;
	}
}
</style>