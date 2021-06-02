<template>
	<code v-if="isShown" class="validation-log-text" v-html="formattedText" />
	<div v-else class="validation-log-button" @click="isShown = true">
		{{translate(language, 'reveal')}}
	</div>
</template>

<script>
import translate from '../../i18n';

export default {
	name: 'ValidationLog',

	props: {
		keyName: {
			type: String
		},
		value: {
			type: String,
			required: true
		},
		language: {
			type: String
		}
	},

	data() {
		return {
			isShown: false,
			translate
		};
	},

	computed: {
		formattedText() {
			return this.value
				.replaceAll('(', '<span class="validation-log-brace">(')
				.replaceAll(')', ')</span>')
				.replaceAll('[', '<span class="validation-log-brace">[')
				.replaceAll(']', ']</span>')
				.replaceAll('&&', '<span class="validation-log-and no-wrap">&&</span>')
				.replaceAll('||', '<span class="validation-log-or no-wrap">||</span>')
				.replaceAll(' < ', ' <span class="validation-log-comp no-wrap"><</span> ')
				.replaceAll(' <= ', ' <span class="validation-log-comp no-wrap"><=</span> ')
				.replaceAll(' >= ', ' <span class="validation-log-comp no-wrap">>=</span> ')
				.replaceAll(' === ', ' <span class="validation-log-comp no-wrap">===</span> ')
				.replaceAll(' > ', ' <span class="validation-log-comp no-wrap">></span> ')
				.replaceAll(' !== ', ' <span class="validation-log-comp no-wrap">!==</span> ');
		}
	},

	mounted() {
		this.isShown = false;
	}
};
</script>

<style lang="scss">
.validation-log-button {
    font-weight: bold;
    color: $primary-color;
    cursor: pointer;
}

.validation-log-text {
    font-size: 75%;
    color: $primary-color;
    white-space: normal;
    word-wrap: normal;
    word-break: normal;
}

.validation-log-brace {
    opacity: 0.8;
    filter: saturate(50%);
}

.validation-log-and {
    color: $pink-color;
}

.validation-log-or {
    color: $pink-color;
}

.no-wrap {
    white-space: nowrap;
}

.validation-log-comp {
    color: $orange-color;
}
</style>
