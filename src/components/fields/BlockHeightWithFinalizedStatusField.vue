<template>
	<div class="blockHeightWithfinalizedStatus">
		<div class="text" @click.stop>
			<router-link :to="getItemHref('blocks', blockHeight)">
				<b class="link">{{ blockHeight }}</b>
			</router-link>

		</div>
		<div class="icon">
			<img
				v-if="this.isFinalized"
				:title="isFinalized ? getTranslation('finalized') : getTranslation('pending')"
				class="icon-finalized"
				:src="FinalizedIcon"
			/>
			<span
				v-else
				:title="isFinalized ? getTranslation('finalized') : getTranslation('pending')"
				class="mdi"
				:class="{[markerIcon]: true}"
			/>
		</div>
	</div>
</template>

<script>
import FinalizedIcon from '../../styles/img/finalized.png';
export default {
	props: {
		value: {
			type: Number,
			required: true
		}
	},

	data() {
		return {
			FinalizedIcon
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

        .icon-finalized {
            height: 12px;
            margin-bottom: 2px;
        }
    }

    .text {
        display: flex;
        align-items: center;
        word-break: normal;
    }
}
</style>
