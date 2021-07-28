<template>
	<div class="payout-root noselect">
		<div class="payouts-container">
			<div class="payouts-wrapper">
				<div
					v-for="(transaction, index) in payouts"
					:key="'' + index + 'payout'"
					class="transaction-item"
				>
					<div class="child-left">
						<img :src="IncomingIcon" class="icon" />
						<div
							v-if="rewardProgram === 'Ecosystem'"
							class="rounds tag"
							:title="getSymbolRoundsDescription(transaction)"
						>
							<img src="../assets/symbol_logo.png" style="height: 14px" title="GRIT" />
							{{transaction.symbolFromRound}}
							-
							{{transaction.symbolToRound}}
							<Boolean :value="transaction.symbolStatus === 'Success'" small/>
						</div>
						<div
							v-else-if="isVotingPayout"
							class="rounds"
							:title="getEpochDescription(transaction)"
						>
							{{transaction.epoch}}
						</div>
						<div
							v-else
							class="rounds"
							:title="getRoundsDescription(transaction)"
						>
							{{transaction.fromRound}}
							-
							{{transaction.toRound}}
						</div>
					</div>
					<div
						v-if="rewardProgram === 'Ecosystem'"
						class="rounds tag"
						:title="getNIS1RoundsDescription(transaction)"
					>
						<img src="../assets/nem_logo.png" style="height: 14px" title="NEM NIS1"/>
						{{transaction.nis1FromRound}}
						-
						{{transaction.nis1ToRound}}
						<Boolean :value="transaction.nis1Status === 'Success'" small/>
					</div>
					<div
						v-else
						class="status"
						:class="getStatusClass(transaction.status)"
						:title="getStatusDescription(transaction.status)"
					>
						{{formatStatus(transaction.status)}}
					</div>
					<div class="date">
						{{formatDate(transaction.updatedAt)}}
					</div>
				</div>
				<ButtonMore
					class="payout-more"
					:canFetchNext="payoutsManager.canFetchNext"
					:isLoading="isLoading"
					:isEmpty="!payouts.length"
					:isError="payoutsManager.error"
					:language="language"
					@next="payoutsManager.fetchNext()"
				/>
			</div>
		</div>
		<Dropdown
			v-if="isFilterShown"
			class="filter"
			:index="filterIndex"
			:options="filterOptions"
			:language="language"
			@change="onChangeFilter"
		/>
	</div>
</template>

<script>
import Dropdown from './Dropdown.vue';
import ButtonMore from './ButtonMore.vue';
import Boolean from './table-components/Boolean.vue';
import IncomingIcon from '../assets/incoming.png';
import translate from '../i18n';
import * as utils from '../utils';

export default {
	name: 'PayoutList',

	components: {
		Dropdown,
		ButtonMore,
		Boolean
	},

	props: {
		payoutsManager: {
			type: Object,
			required: true
		},
		rewardProgram: {
			type: String,
			required: true
		},
		language: {
			type: String
		}
	},

	mounted() {
		this.payouts = [];
		if (this.payoutsManager)
			this.payoutsManager.reset();
	},

	data() {
		return {
			IncomingIcon,
			pageNumber: 1,
			payouts: []
		};
	},

	computed: {
		isLoading() {
			return this.payoutsManager && this.payoutsManager.loading;
		},

		data() {
			return (this.payoutsManager && this.payoutsManager.data) || [];
		},

		isFilterShown() {
			return this.rewardProgram !== 'Ecosystem' && this.rewardProgram !== 'EarlyAdoption';
		},

		filterIndex() {
			return (this.payoutsManager && this.payoutsManager.filterIndex) || 0;
		},

		filterOptions() {
			return (this.payoutsManager && this.payoutsManager.filterOptions) || [];
		},

		isVotingPayout() {
			return this.filterIndex === 1;
		}
	},

	methods: {
		updateList(data) {
			// this.payouts = [];
			let animationArray = [...data];
			const timer = setInterval(() => {
				if (!animationArray.length)
					clearInterval(timer);
				const payout = animationArray.shift();

				if (payout)
					this.payouts.push(payout);
			}, 25);
		},

		formatAddress(address) {
			return utils.trunc(address, 'middle', 7, 4);
		},

		getRoundsDescription(range) {
			return translate(this.language, 'roundRange', range);
		},

		getSymbolRoundsDescription(range) {
			return this.getRoundsDescription({
				fromRound: range.symbolFromRound,
				toRound: range.symbolToRound
			});
		},

		getNIS1RoundsDescription(range) {
			return this.getRoundsDescription({
				fromRound: range.nis1FromRound,
				toRound: range.nis1ToRound
			});
		},

		getEpochDescription(epoch) {
			return translate(this.language, 'epochValue', epoch);
		},

		formatMosaic(mosaics) {
			return utils.getNativeMosaicPreview(mosaics) || {};
		},

		formatDate(date) {
			return date ? utils.formatDate(date, this.language, true, false) : '';
		},

		formatStatus(status) {
			return translate(this.language, status);
		},

		getStatusDescription(status) {
			return translate(this.language, status + '_desc');
		},

		getStatusClass(status) {
			switch (status) {
			case 'Success':
			case 'Completed':
				return 'color-ok';
			case 'ToBeProcess':
			case 'Processing':
			case 'ManualReview':
				return 'color-await';
			case 'Fail':
				return 'color-fail';
			}
		},

		onChangeFilter(index) {
			this.payouts = [];
			this.payoutsManager && this.payoutsManager.changeFilterValue(index);
		}
	},

	watch: {
		data(e) {
			this.updateList(e);
		}
	}
};
</script>

<style lang="scss" scoped>
.payout-root {
    padding-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.payouts-container {
    position: relative;
    width: 100%;
    max-width: 400px;
}

.filter {
    margin-bottom: 5px;
    position: absolute;
    bottom: 0;
    right: 0;
}

.transaction-item {
    position: relative;
    background: #fff;
    border-radius: 6px;
    height: 40px;
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    animation: fadein 1s;
}

.child-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 33%;
}

.icon {
    height: 20px;
}

.rounds {
    color: #333;
    font-size: 10px;
    margin-left: 15px;
    cursor: help;
}

.tag {
    background: #f2f3f8;
    border-radius: 10px;
    padding: 2px 5px;
}

.status {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    max-width: 30%;
    text-align: center;
    font-weight: 700;
    font-size: 10px;
    cursor: help;
}

.color-ok {
    color: #33dd50;
}

.color-await {
    color: #ff9600;
}

.color-fail {
    color: red;
}

.amount {
    color: #33dd50;
    font-weight: 700;
    font-size: 10px;
}

.decimal {
    display: inline;
    opacity: 0.65;
    font-size: 75%;
}

.date {
    color: #999;
    font-size: 10px;
    max-width: 30%;
}

.payout-pagination {
    position: absolute;
    bottom: 0;
    right: 0;
}

@keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
