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
			:title="getTranslation('message') + ': ' + message">
			<MessageCircle
				style="width: 16px; height: 16px"
				:message="message"
			/>
		</span>

		<span
			v-if="hasMosaics"
			:title="getTranslation('mosaics')">
			<MosaicsCircle
				style="width: 16px; height: 16px"
				id="target"
				:mosaics="[]"
			/>
		</span>

		<span
			v-if="hasNativeMosaic"
			:title="nativeMosaic + ' ' + networkCurrency"
			:class="amountClass"
			style="display: flex"
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
			type: String
		}
	},

	computed: {
		hasNativeMosaic() {
			if (this.value.nativeMosaic)
				return this.value.nativeMosaic !== 'N/A';

			return false;
		},
		hasMessage() {
			if (this.value.message)
				return typeof this.value.message.payload === 'string' && this.value.message.payload.length > 0;

			return false;
		},

		hasMosaics() {
			if (this.value.mosaics)
				return Array.isArray(this.value.mosaics) && this.value.mosaics.length > 0;

			return false;
		},

		nativeMosaic() {
			if (this.value.nativeMosaic) {
				const amount = this.value.nativeMosaic.replace(/,/g, '');

				if (Number.isInteger(Number(amount)))
					return Number(amount).toLocaleString('en-US');
				return this.value.nativeMosaic;
			}

			return '';
		},

		message() {
			return this.value.message || '';
		},

		mosaics() {
			return this.value.mosaics || [];
		},

		networkCurrency() {
			return http.networkCurrency.namespaceName;
		},

		networkCurrencySub() {
			// eslint-disable-next-line no-constant-condition
			if (
				typeof http.networkCurrency.namespaceName === 'string' &&
				http.networkCurrency.namespaceName.length > 0
			) {
				const namespaceLevels = http.networkCurrency.namespaceName.split('.');

				return ' ' + namespaceLevels.pop()?.toUpperCase();
			}

			return '';
		},

		amountClass() {
			if (typeof this.transactionType === 'string' && this.transactionType.includes('incoming'))
				return 'incoming';
			if (typeof this.transactionType === 'string' && this.transactionType.includes('outgoing'))
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
    color: $green-color;
}

.outgoing {
    color: $red-color;
}
</style>
