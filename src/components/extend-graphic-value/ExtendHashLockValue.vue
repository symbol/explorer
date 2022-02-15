<template>
	<span
		v-if="hasAmount"
		:title="getTranslation('amount') + ': ' + amount"
		style="display: flex;"
	>
		<Decimal :value="amount" class="decimal"/> {{ networkCurrency }}
	</span>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';
import Decimal from '@/components/fields/Decimal.vue';
import http from '../../infrastructure/http';

export default {
	extends: GraphicComponent,

	components: {
		Decimal
	},

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasAmount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('amount'))
					return 'string' === typeof item.amount && 0 < item.amount.length;
			}
			return false;
		},

		amount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('amount')) {
					const amount = item.amount.replace(/,/g, '');

					if (Number.isInteger(Number(amount)))
						return Number(amount).toLocaleString('en-US');
					return item.amount;
				}
			}
			return '0';
		},

		networkCurrency () {
			// eslint-disable-next-line no-constant-condition
			if (
				'string' === typeof http.networkCurrency.namespaceName &&
				0 < http.networkCurrency.namespaceName.length
			) {
				const namespaceLevels = http.networkCurrency.namespaceName.split('.');

				return ' ' + namespaceLevels.pop()?.toUpperCase();
			}

			return '';
		}

	}

};
</script>
