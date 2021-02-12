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
			v-if="hasNativeMosaic"
			:title="nativeMosaic + ' ' + networkCurrency"
		>
			<Decimal :value="nativeMosaic" class="decimal"/> {{ networkCurrencySub }}
		</span>

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
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasNativeMosaic() {
			for (const item of this.value) {
				if (Object.keys(item).includes('nativeMosaic'))
					return item.nativeMosaic !== 'N/A';
			}
			return false;
		},
		hasMessage() {
			for (const item of this.value) {
				if (Object.keys(item).includes('message'))
					return typeof item.message.payload === 'string' && item.message.payload.length > 0;
			}
			return false;
		},

		hasMosaics() {
			for (const item of this.value) {
				if (Object.keys(item).includes('mosaics'))
					return Array.isArray(item.mosaics) && item.mosaics.length > 0;
			}
			return false;
		},

		nativeMosaic() {
			for (const item of this.value) {
				if (Object.keys(item).includes('nativeMosaic')) {
					const amount = item.nativeMosaic.replace(/,/g, '');

					if (Number.isInteger(Number(amount)))
						return Number(amount).toLocaleString('en-US');
					return item.nativeMosaic;
				}
			}

			return '';
		},

		message() {
			for (const item of this.value) {
				if (Object.keys(item).includes('message'))
					return item.message;
			}

			return '';
		},

		mosaic() {
			for (const item of this.value) {
				if (Object.keys(item).includes('mosaics'))
					return item.mosaics;
			}

			return [];
		},

		networkCurrency() {
			return http.networkCurrency.namespaceName;
		},

		networkCurrencySub() {
			// eslint-disable-next-line no-constant-condition
			return typeof (http.networkCurrency.namespaceName === 'string' &&
				http.networkCurrency.namespaceName.length > 0)
				? http.networkCurrency.namespaceName.split('.')[http.networkCurrency.namespaceName.length - 1]
				: '';
		}
	}

};
</script>

<style lang="scss" scoped>
.extendGraphicValueContainer {
    display: inline-flex;
}
</style>
