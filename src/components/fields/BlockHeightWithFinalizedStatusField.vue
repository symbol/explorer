<template>
	<div>
		<div v-if="isClickable" class="blockHeightWithfinalizedStatus">
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
					:src="LockIcon"
				/>
				<span
					v-else
					:title="isFinalized ? getTranslation('finalized') : getTranslation('pending')"
					class="mdi"
					:class="{[markerIcon]: true}"
				/>
			</div>
		</div>

		<div v-else>
			<div class="text" @click.stop>
				<b class="link">{{ blockHeight }}</b>
			</div>
		</div>
	</div>
</template>

<script>
import TableView from '../tables/TableView.vue';
import LockIcon from '../../styles/img/lock.png';

export default {
	extends: TableView,

	props: {
		value: {
			type: [Number, String],
			required: true
		}
	},

	data () {
		return {
			LockIcon
		};
	},

	computed: {
		markerIcon () {
			if (this.isFinalized)
				return 'mdi-lock';
			return 'mdi-clock-outline';
		},
		blockHeight () {
			return this.value;
		},
		getLatestFinalizedHeight () {
			return this.$store.getters['chain/getChainInfo'].finalizedBlockHeight;
		},
		isFinalized () {
			return this.getLatestFinalizedHeight >= this.blockHeight;
		},
		isClickable () {
			return this.isValueClickable(this.value);
		}
	},

	methods: {
		getItemHref (itemKey, item) {
			return this.$store.getters['ui/getPageHref']({ pageName: itemKey, param: item });
		},
		getTranslation (key) {
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
            height: 15px;
            margin-bottom: 2px;
            filter: var(--icon-invert);
        }
    }

    .text {
        display: flex;
        align-items: center;
        word-break: normal;
    }
}
</style>
