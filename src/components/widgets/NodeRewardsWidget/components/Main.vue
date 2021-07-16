<template>
	<div class="main-root">
		<div>
			<div class="program">{{data.rewardProgram}}</div>
			<div class="node">{{data.friendlyName}} | {{data.host}}</div>
		</div>
		<History v-if="data.history" :data="data.history" :language="language" class="history" />
	</div>
</template>

<script>
import * as utils from '../utils';
import translate from '../i18n';
import History from './History.vue';
import ConnectorIcon from '../assets/connector.png';

export default {
	name: 'Main',

	components: { History },

	props: {
		data: {
			type: Object,
			required: true
		},
		language: {
			type: String
		}
	},

	data() {
		return {
			translate,
			ConnectorIcon
		};
	},

	computed: {
		balanceTitle() {
			if (this.data.balance && this.data.balance.passed)
				return this.translate(this.language, 'balanceTitle');
			return this.translate(this.language, 'balanceFailedTitle');
		},

		_balance() {
			if (this.data.balance && this.data.balance.value) {
				const mosaic = this.formatMosaic(this.data.balance.value);

				return mosaic;
			}

			return {};
		},
		_expectedBlance() {
			if (this.data.balance && this.data.balance.expectedValue) {
				const mosaic = this.formatMosaic(this.data.balance.expectedValue);

				return mosaic;
			}

			return {};
		},
		_mosaicName() {
			if (this.data.balance && this.data.balance.value) {
				const mosaic = this.formatMosaic(this.data.balance.value);

				return mosaic.mosaicName.toUpperCase();
			}

			return '';
		}
	},

	methods: {
		formatDate(date) {
			return utils.formatDate(date, this.language);
		},

		formatMosaic(mosaic) {
			return utils.getNativeMosaicPreview([mosaic]);
		}
	}
};
</script>

<style lang="scss" scoped>
.main-root {
    padding-top: 20px;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .program {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 5px;
    }

    .node {
        font-size: 12px;
    }

    .connector-icon {
        height: 16px;
    }

    .balance {
        font-size: 12px;
    }

    .decimal {
        display: inline;
        opacity: 0.65;
        font-size: 75%;
    }

    .inline {
        display: inline;
    }
}
</style>
