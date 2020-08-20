<template>
	<div class="finalizedBlockMarker">
        <div class="text">
			{{ blocksHeight }}
		</div>
		<div class="icon">
            <span class="mdi" :class="{[markerIcon]: true}"/>
		</div>
	</div>
</template>

<script>
import IconLock from '../../styles/img/tx-lock.png';

export default {
    props: {
		value: {
			type: Object,
			required: true
		}
    },

    data() {
		return {
			IconLock,
		};
	},

    computed: {
        markerIcon() {
            if (this.value.status === true)
                return `mdi-lock`
            return `mdi-clock-outline`
        },
        blocksHeight() {
            return this.value.blockHeight
        }
    }
}
</script>

<style lang="scss" scoped>
.finalizedBlockMarker {
    display: flex;

    .icon {
        margin-left: 10px;
    }

    .text {
        display: flex;
        align-items: center;
        word-break: normal;
    }
}
</style>