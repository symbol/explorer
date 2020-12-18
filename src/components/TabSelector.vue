<template>
	<div class="tab-selector">
		<div 
			v-for="(item, index) in tabs"
			class="tab-item" 
			:key="'' + index + 'tab-sel'"
			@click="()=> $emit('onSelect', index)"
		>
			{{ translate(language, index) }}
		</div>
	</div>
</template>

<script>
import translate from '../i18n';
import TestItem from './TestItem.vue';

export default {
	name: 'Table',

	components: { TestItem },

	props: {
		tabs: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		},
	},

	data() {
		return {
			translate
		}
	}
}
</script>

<style lang="scss">
.table-root {
	background: transparent;
	position: relative;
}

.table-component {
	table-layout: fixed;
	width: 100%;
}

.vert-line {
	z-index: 0;
	top: -20%;
	right: 50px;
	position: absolute;
    width: 1px;
	height: 130%;
    background-image: linear-gradient(to bottom, rgba(255, 0, 255, 0), $pink-color, rgba(0, 0, 0, 0));
}
</style>