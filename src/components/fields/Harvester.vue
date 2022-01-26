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
	<div class="harvester-container">
		<span :title="title" >
			<router-link :to="getItemHref('accounts', value.linkedAddress)">
				<b class="link text-truncate">{{ value.signer }}</b>
			</router-link>
		</span>
	</div>
</template>

<script>
import TableView from '@/components/tables/TableView.vue';

export default {
	name: 'Harvester',
	extends: TableView,
	props: {
		value: Object
	},
	computed: {
		title () {
			return this.getKeyName('remote') +
			': ' + this.value.signer +
			'\n' + this.getKeyName('main') +
			': ' + this.value.linkedAddress;
		}
	}
};
</script>
