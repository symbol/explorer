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
	<div>
		<div v-if="isPlainMessage">
			{{ message }}

			<div v-if="isHexString">
				<div
					class="viewOptions"
					@click="convertViewFormat">
						{{ viewFormatTitle }}
				</div>
			</div>
		</div>

		<div v-else @click="clickToView">
			<div class="overlay" :class="{'hideContent': !isClick}" >
				{{ title }}
			</div>

			<div :class="{'hideContent': isClick}">
				{{ message }}
			</div>
		</div>
	</div>
</template>

<script>
import TableView from '@/components/tables/TableView.vue';
import { MessageType, Convert } from 'symbol-sdk';

export default {
	name: 'MessageField',
	extends: TableView,
	props: {
		value: {
			type: Object,
			default: () => {}
		}
	},
	data () {
		return {
			isClick: true,
			isViewAsUTF8: false
		};
	},
	computed: {
		message () {
			return this.getMessage();
		},
		messageType () {
			return this.value.type;
		},
		isPlainMessage () {
			return this.value.type === MessageType.PlainMessage || this.value.type === MessageType.RawMessage;
		},
		title () {
			return `Click to view ${this.getKeyName(`messageTypeDescriptor_${this.messageType}`)}`;
		},
		viewFormatTitle () {
			return this.isViewAsUTF8 ? `View as default` : `View as utf-8`;
		},
		isHexString () {
			return this.value.payload && Convert.isHexString(this.value.payload);
		}
	},
	methods: {
		clickToView () {
			this.isClick = !this.isClick;
		},
		convertViewFormat () {
			this.isViewAsUTF8 = !this.isViewAsUTF8;
		},
		getMessage () {
			if (this.isViewAsUTF8) {
				return this.convertToUtf8(this.value.payload);
			}
			return this.value.payload;
		},
		convertToUtf8 (payload) {
			if (this.isHexString) {
				const hexToUint8 = Convert.hexToUint8(payload);
				return new TextDecoder('utf-8').decode(hexToUint8);
			}
			return payload;
		}
	}
};
</script>

<style lang="scss" scoped>
.hideContent {
    display: none;
}

.overlay {
    text-align: center;
    position: absolute;
    color: var(--clickable-text);
    z-index: 999;

    :hover > & {
        cursor: pointer;
        text-decoration: underline;
    }
}

.viewOptions {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    max-width: 150px;
    width: 100%;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    padding: 5px 10px;
    border-color: var(--clickable-text);
    color: var(--clickable-text);

    :hover > & {
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>
