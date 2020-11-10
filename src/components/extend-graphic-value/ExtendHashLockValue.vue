<template>
	<span
		v-if="hasAmount"
		:title="getTranslation('amount') + ': ' + amount">
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
		hasAmount() {
			for (const item of this.value) {
				if (Object.keys(item).includes('amount'))
					return typeof item.amount === 'string' && item.amount.length > 0;
			}
			return false;
		},

		amount() {
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

		networkCurrency() {
			return http.networkCurrency.namespaceName;
		}

	}

};
</script>
