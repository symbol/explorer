<template>
	<b-button
		exact
		active-class="active"
		class="btn-green noselect pointer"
		@click="$emit('click')"
	>
		<span><slot/></span>
		<IconArrowRight v-if="!noIcon" class="more-icon" />
	</b-button>
</template>

<script>
import IconArrowRight from 'vue-material-design-icons/ArrowRight.vue';
export default {
	components: {
		IconArrowRight
	},
	props: {
		noIcon: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style lang="scss" scoped>
.more-icon {
    font-size: 15px;
    margin-left: 5px;
    margin-top: 1px;
    transform: rotate(-45deg);
}

.btn-green {
    border: transparent;
    border-radius: 4px;
    color: var(--clickable-text);
    font-size: 16px;
    padding: 5px 12px 5px 12px;
    line-height: 1.6;
    position: relative;
    background: transparent;
}

.btn-green i {
    font-size: 24px;
    line-height: 0;
    position: relative;
    top: -4px;
    right: -4px;
    height: 20px;
}

.btn-green * {
    display: inline-block;
    position: relative;
    z-index: 1;
    text-transform: uppercase;
}

.btn-green::before {
    content: '';
    background: var(--sub-card-border);
    width: 0;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    transition: all 0.4s cubic-bezier(0, 0, 0.23, 1);
    border-radius: 12px;
}

.btn-green:hover {
    color: #fff;
}

.btn-green:hover::before {
    width: 100%;
}

.pointer {
    cursor: pointer;
}
</style>
