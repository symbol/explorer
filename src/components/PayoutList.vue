<template>
	<div class="payout-root">
		<div class="payouts-container">
			<div class="payouts-wrapper">
				<!-- <LoadingAnimation v-if="isLoading" transition="fade" /> -->
				<div
					v-for="(transaction, index) in payouts"
					:key="'' + index + 'payout'"
					class="transaction-item"
				>
					<div class="child-left">
						<img :src="IncomingIcon" class="icon" />
						<div 
							class="rounds"
							:title="getRoundsDescription(transaction)"
						>
							<!-- {{formatAddress(transaction.recipientAddress)}} -->
							{{transaction.fromRound}}
							-
							{{transaction.toRound}}
						</div>
					</div>
					<div 
						class="status"
						:class="getStatusClass(transaction.status)"
						:title="getStatusDescription(transaction.status)"
					>
						<!-- {{formatMosaic(transaction.mosaics).amountInt}}<div class="decimal">{{formatMosaic(transaction.mosaics).amountDec}}</div>
						{{formatMosaic(transaction.mosaics).mosaicName}} -->
						{{formatStatus(transaction.status)}}
					</div>
					<div class="date">
						{{formatDate(transaction.createdAt)}}
					</div>
				</div>
				<ButtonMore
					class="payout-more"
					:canFetchNext="payoutsManager.canFetchNext"
					:isLoading="isLoading"
					:language="language"
					@next="payoutsManager.fetchNext()" 
				/>
			</div>
		</div>
	</div>
</template>

<script>
import LoadingAnimation from './LoadingAnimation.vue';
import Pagination from './Pagination.vue';
import ButtonMore from './ButtonMore.vue';
import IncomingIcon from '../assets/incoming.png';
import translate from '../i18n';
import * as utils from '../utils';

export default {
	name: 'PayoutList',

	components: {
		Pagination,
		LoadingAnimation,
		ButtonMore
	},

	props: {
		payoutsManager: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		},
	},

	mounted() {
		this.payouts = [];
		if(this.payoutsManager) {
			this.payoutsManager.reset();
		}
	},

	data() {
		return {
			IncomingIcon,
			pageNumber: 1,
			payouts: []
		}
	},

	computed: {
		isLoading() {
			return this.payoutsManager && this.payoutsManager.loading;
		},

		data() {
			return (this.payoutsManager && this.payoutsManager.data) || [];
		}
	},

	methods: {
		updateList(data) {
			//this.payouts = [];
			let animationArray = [... data];
			const timer = setInterval(() => {
				if(!animationArray.length)
					clearInterval(timer);
				const payout = animationArray.shift();
				if(payout)
					this.payouts.push(payout);
			}, 25)
		},

		formatAddress(address) {
			return utils.trunc(address, 'middle', 7, 4);
		},

		getRoundsDescription(range) {
			return translate(this.language, 'roundRange', range);
		},

		formatMosaic(mosaics) {
			return utils.getNativeMosaicPreview(mosaics) || {}
		},

		formatDate(date) {
			return utils.formatDate(date, this.language, true, false)
		},

		formatStatus(status) {
			return translate(this.language, status);
		},

		getStatusDescription(status) {
			return translate(this.language, status + '_desc');
		},

		getStatusClass(status) {
			switch(status) {
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

		infiniteHandler($state) {
			this.payoutsManager.getPayouts('', this.pageNumber)
				.then(payouts => {
					if (payouts.length) {
						this.pageNumber += 1;
						this.updateList(payouts);
						$state.loaded();
					} else {
						$state.complete();
					}
				});
		}
	},

	watch: {
		data(e) {
			console.log(e)
			this.updateList(e);
		}
	}
}
</script>

<style lang="scss" scoped>
.payout-root {
	padding-top: 20px;
	// height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
}

.payouts-container {
	position: relative;
	width: 100%;
	max-width: 400px;
	// box-shadow: inset 0px 0px 40px rgba(67, 0, 78, 0.5);
}

.transaction-item {
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

.status {
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
}

.payout-pagination {
	position: absolute;
	bottom: 0;
	right: 0;
}

@keyframes fadein {
	from { opacity: 0; }
	to   { opacity: 1; }
}

</style>