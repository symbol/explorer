/*
 *
 * Copyright (c) 2021-present for NEM
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
		<span :class="{'color-light': isExpired}">
			{{ epochStatus }} : {{ epochStart }} - {{ epochEnd }}
		</span>
	</div>
</template>
<script>
import TableView from '@/components/tables/TableView.vue';
import Constants from '../../config/constants';

export default {
	name: 'EpochInfoField',
	extends: TableView,
	props: {
		value: {
			type: Object,
			required: true
		}
	},
	computed: {
		epochStatus () {
			return this.getKeyName(this.value.epochStatus.toLowerCase());
		},
		epochStart () {
			return `${this.getKeyName('epoch')} ${this.value.epochStart}`;
		},
		epochEnd () {
			return `${this.getKeyName('epoch')} ${this.value.epochEnd}`;
		},
		isExpired () {
			return this.value.epochStatus === Constants.EpochStatus.EXPIRED;
		}
	}
};
</script>

<style lang="scss" scoped>
.color-light {
    opacity: 0.5;
}
</style>
