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
			<b-col xs="12" md="12" lg="9" style="display: flex;">
				<ChartBlockTimeDifference style="width: 100%;" />
			</b-col>
			<b-col xs="12" md="12" lg="3" style="display: flex;">
				<NetworkFeesWidget style="width: 100%;" />
			</b-col>

			<b-col xs="12" md="12" lg="9" style="display: flex;">
				<ChartTransactionPerBlock style="width: 100%;" />
			</b-col>
			<b-col xs="12" md="12" lg="3" style="display: flex;">
				<NetworkRentalFeesWidget style="width: 100%;" />
			</b-col>

			<b-col xs="12" md="6" style="display: flex;">
				<NodeHeightStatsWidget style="width: 100%;" type="height" />
			</b-col>
			<b-col xs="12" md="6" style="display: flex;">
				<NodeHeightStatsWidget style="width: 100%;" type="finalizedHeight" />
			</b-col>
			<b-col xs="12" md="12" style="display: flex;">
				<ChartNodeCount style="width: 100%;" />
			</b-col>
		</b-row>
	</b-container>
</template>
<script>
import NetworkFeesWidget from '../components/widgets/NetworkFeesWidget.vue';
import NetworkRentalFeesWidget from '../components/widgets/NetworkRentalFeesWidget.vue';
import ChartBlockTimeDifference from '../components/widgets/ChartBlockTimeDifference.vue';
import ChartTransactionPerBlock from '../components/widgets/ChartTransactionPerBlock.vue';
import NodeHeightStatsWidget from '../components/widgets/NodeHeightStatsWidget.vue';
import ChartNodeCount from '../components/widgets/ChartNodeCount.vue';

export default {
	name: 'Statistics',
	components: {
		NetworkFeesWidget,
		NetworkRentalFeesWidget,
		ChartBlockTimeDifference,
		ChartTransactionPerBlock,
		NodeHeightStatsWidget,
		ChartNodeCount
	},
	mounted () {
		this.$store.dispatch('initialize', this.$route);
	}
};
</script>

<style lang="scss" scoped>
.widget-outer {
    display: flex;
}

.widget-inner {
    width: 100%;
}
</style>
