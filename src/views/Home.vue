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
	<b-container fluid class="px-0 py-0">
		<b-row class="my-4 mx-0 mx-xs-0 mx-md-4 mx-lg-8">
			<!-- <b-col xs="12" md="12" lg="9" style="display: flex">
				<PriceChartWidget style="width: 100%"/>
			</b-col> -->
			<b-col xs="12" md="12" lg="12" style="display: flex;">
				<BaseInfoWidget style="width: 100%;"/>
			</b-col>
			<b-col xs="12" md="12" lg="6" style="display: flex;">
				<RecentBlocksWidget style="width: 100%;"/>
			</b-col>
			<b-col xs="12" md="12" lg="6" style="display: flex;">
				<RecentTransactionsWidget style="width: 100%;"/>
			</b-col>
			<b-col xs="12" md="12" lg="6" style="display: flex;"
				v-for="(list, index) in recentListWidgetSetup"
				:key="`recent_list_${index}`">
				<RecentListWidget style="width: 100%;"
					:title="list.title"
					:viewMoreLinkURL="list.viewMoreLinkURL"
					:dataGetter="list.dataGetter"
					:headerField="list.headerField"
					:fields="list.fields"
				/>
			</b-col>
		</b-row>
	</b-container>
</template>
<script>
import BaseInfoWidget from '@/components/widgets/BaseInfoWidget.vue';
// import PriceChartWidget from '@/components/widgets/PriceChartWidget.vue';
import RecentBlocksWidget from '@/components/widgets/RecentBlocksWidget.vue';
import RecentTransactionsWidget from '@/components/widgets/RecentTransactionsWidget.vue';
import RecentListWidget from '@/components/widgets/RecentListWidget.vue';

export default {
	name: 'Home',

	components: {
		BaseInfoWidget,
		// PriceChartWidget,
		RecentBlocksWidget,
		RecentTransactionsWidget,
		RecentListWidget
	},

	data () {
		return {
			recentListWidgetSetup: [
				{
					title: 'recentNamespaces',
					viewMoreLinkURL: '/namespaces',
					dataGetter: 'namespace/getRecentList',
					headerField: 'namespaceName',
					fields: ['approximateExpired', 'ownerAddress']
				},
				{
					title: 'recentMosaics',
					viewMoreLinkURL: '/mosaics',
					dataGetter: 'mosaic/getRecentList',
					headerField: 'mosaicId',
					fields: ['relativeAmount', 'ownerAddress']
				}
			]
		};
	},

	mounted () {
		this.$store.dispatch('initialize', this.$route);
	}
};
</script>
