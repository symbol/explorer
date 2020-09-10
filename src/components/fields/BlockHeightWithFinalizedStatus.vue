<template>
	<div class="blockHeightWithfinalizedStatus">
		<div class="text">
			<router-link :to="getItemHref('blocks', blocksHeight)">
				<b class="link">{{ blocksHeight }}</b>
			</router-link>

		</div>
		<div class="icon">
			<span class="mdi" :class="{[markerIcon]: true}"/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			required: true
		}
	},

	data() {
		return {
		};
	},

	computed: {
		markerIcon() {
			if (this.getLatestFinalizedHeight >= this.value)
				return `mdi-lock`;
			return `mdi-clock-outline`;
		},
		blocksHeight() {
			return this.value;
		},
		getLatestFinalizedHeight() {
			// Todo: Get latest Finalized height from getter
			return this.$store.getters[`chain/getBlockHeight`] - 18
		}
	},

	methods: {
		getItemHref(itemKey, item) {
			return this.$store.getters[`ui/getPageHref`]({ pageName: itemKey, param: item });
		}
	}
};
</script>

<style lang="scss" scoped>
.blockHeightWithfinalizedStatus {
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
