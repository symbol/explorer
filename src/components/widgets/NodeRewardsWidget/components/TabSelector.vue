<template>
	<div class="tab-selector noselect">
		<div
			v-for="(item, index) in tabs"
			class="tab-item tab-item--hover1"
			:class="{'tab-item-active': index === activeTab}"
			:key="'' + index + 'tab-sel'"
			@click="()=> $emit('select', index)"
		>
			{{ translate(language, index) }}
		</div>
	</div>
</template>

<script>
import translate from '../i18n';

export default {
	name: 'TabSelector',

	props: {
		tabs: {
			type: Object,
			required: true
		},
		activeTab: {
			type: String
		},
		language: {
			type: String
		}
	},

	data() {
		return {
			translate
		};
	}
};
</script>

<style lang="scss" scoped>
.tab-selector {
    overflow: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.tab-item {
    color: #fffa;
    margin-right: 40px;
    cursor: pointer;
    position: relative;
    overflow: visible !important;
}

@media (max-width: 500px) {
    .tab-item {
        color: #fffa;
        margin-right: 20px;
        cursor: pointer;
        position: relative;
        overflow: visible !important;
    }
}

.tab-item--hover::after {
    display: block;
    content: "";
    position: relative;
    left: 0.0625rem;
    height: 0.0625rem;
    width: 50%;
    background-color: #f0f;
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.tab-item--hover:hover::after {
    transform: scaleX(1);
    transform-origin: 0 50%;
    transition-timing-function: ease;
}

.tab-item-active {
    color: #f0f;
}
</style>
