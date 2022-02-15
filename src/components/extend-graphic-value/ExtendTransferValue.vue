/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

<template>
	<div class="extendGraphicValueContainer">
		<span
			v-if="hasMessage"
			title="">
			<MessageCircle
				style="width: 16px; height: 16px;"
				:message="message"
			/>
		</span>

		<span
			v-if="hasMosaics"
			:title="getTranslation('mosaics')">
			<MosaicsCircle
				style="width: 16px; height: 16px;"
				id="target"
				:mosaics="[]"
			/>
		</span>

		<span
			v-if="hasNativeMosaic"
			:title="getTranslation('amount') + ': ' + nativeMosaic + ' ' + networkCurrency"
			:class="amountClass"
			style="display: flex;"
		>
			<Decimal :value="nativeMosaic" class="decimal"/> {{ networkCurrencySub }}
		</span>
	</div>
</template>

<script>
import MessageCircle from '@/components/graphics/MessageCircle.vue';
import MosaicsCircle from '@/components/graphics/MosaicsCircle.vue';
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';

import Decimal from '@/components/fields/Decimal.vue';
import http from '../../infrastructure/http';

export default {
	extends: GraphicComponent,

	components: {
		MessageCircle,
		MosaicsCircle,
		Decimal
	},

	props: {
		value: {
			type: Object,
			required: true,
			default: () => ({})
		},
		transactionType: {
			type: [String, Number]
		}
	},

	computed: {
		hasNativeMosaic () {
			if (this.value.nativeMosaic)
				return 'N/A' !== this.value.nativeMosaic;

			return false;
		},
		hasMessage () {
			if (this.value.message)
				return 'string' === typeof this.value.message.payload && 0 < this.value.message.payload.length;

			return false;
		},

		hasMosaics () {
			if (this.value.mosaics)
				return Array.isArray(this.value.mosaics) && 0 < this.value.mosaics.length;

			return false;
		},

		nativeMosaic () {
			if (this.value.nativeMosaic) {
				const amount = this.value.nativeMosaic.replace(/,/g, '');

				if (Number.isInteger(Number(amount)))
					return Number(amount).toLocaleString('en-US');
				return this.value.nativeMosaic;
			}

			return '';
		},

		message () {
			return this.value.message || '';
		},

		mosaics () {
			return this.value.mosaics || [];
		},

		networkCurrency () {
			return http.networkCurrency.namespaceName;
		},

		networkCurrencySub () {
			// eslint-disable-next-line no-constant-condition
			if (
				'string' === typeof http.networkCurrency.namespaceName &&
				0 < http.networkCurrency.namespaceName.length
			) {
				const namespaceLevels = http.networkCurrency.namespaceName.split('.');

				return ' ' + namespaceLevels.pop()?.toUpperCase();
			}

			return '';
		},

		amountClass () {
			if ('string' === typeof this.transactionType && this.transactionType.includes('incoming'))
				return 'incoming';
			if ('string' === typeof this.transactionType && this.transactionType.includes('outgoing'))
				return 'outgoing';
			return '';
		}
	}

};
</script>

<style lang="scss" scoped>
.extendGraphicValueContainer {
    display: inline-flex;
}

.incoming {
    color: var(--balance-green-text);
}

.outgoing {
    color: $red-color;
}
</style>
