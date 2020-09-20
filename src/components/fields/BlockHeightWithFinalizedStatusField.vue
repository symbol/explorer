<template>
	<div class="blockHeightWithfinalizedStatus">
		<div class="text">
			<router-link :to="getItemHref('blocks', blockHeight)">
				<b class="link">{{ blockHeight }}</b>
			</router-link>

		</div>
		<div class="icon">
			<span
				:title="isFinalized ? getTranslation('finalized') : getTranslation('pending')"
				class="mdi"
				:class="{[markerIcon]: true}"
			/>
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
			if (this.isFinalized)
				return `mdi-lock`;
			return `mdi-clock-outline`;
		},
		blockHeight() {
			return this.value;
		},
		getLatestFinalizedHeight() {
			return this.$store.getters[`chain/getChainInfo`].finalizedBlockHeight;
		},
		isFinalized() {
			return this.getLatestFinalizedHeight >= this.blockHeight;
		}
	},

	methods: {
		getItemHref(itemKey, item) {
			return this.$store.getters[`ui/getPageHref`]({ pageName: itemKey, param: item });
		},
		getTranslation(key) {
			return this.$store.getters['ui/getNameByKey'](key);
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
