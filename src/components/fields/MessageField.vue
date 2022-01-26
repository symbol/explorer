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
import { MessageType } from 'symbol-sdk';

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
			isClick: true
		};
	},
	computed: {
		message () {
			return this.value.payload;
		},
		messageType () {
			return this.value.type;
		},
		isPlainMessage () {
			return this.value.type === MessageType.PlainMessage || this.value.type === MessageType.RawMessage;
		},
		title () {
			return `Click to view ${this.getKeyName(`messageTypeDescriptor_${this.messageType}`)}`;
		}
	},
	methods: {
		clickToView () {
			this.isClick = !this.isClick;
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
</style>
