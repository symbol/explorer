<template>
	<div class="main-root">
		<div class="name">{{data.nodeName}}</div>
		<div class="round">{{translate(language, 'roundNumber', {number: data.roundNumber})}}</div>
		<div class="date">{{formatDate(data.testDate)}}</div>
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

	.name {
		font-weight: 700;
		font-size: 18px;
		margin-bottom: 5px;
	}
	
	.round {
		
	}

	.date {
		font-size: 12px;
	}

	.history {
		max-width: 500px;
		//margin: 0;
		//float: right;
	}
}
</style>