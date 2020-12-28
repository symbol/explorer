<template>
	<div class="payout-root">
		<div class="transactions-container">
			<div class="transactions-wrapper">
				<div
					v-for="(transaction, index) in transactions"
					:key="'' + index + 'payout'"
					class="transaction-item"
				>
					<div class="child-left">
						<img :src="IncomingIcon" class="icon" />
						<div class="address">
							{{formatAddress(transaction.recipientAddress)}}
						</div>
					</div>
					<div class="amount">
						{{formatMosaic(transaction.mosaics).amountInt}}<div class="decimal">{{formatMosaic(transaction.mosaics).amountDec}}</div>
						{{formatMosaic(transaction.mosaics).mosaicName}}
					</div>
					<div class="date">
						{{formatDate(transaction.date)}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import IncomingIcon from '../assets/incoming.png';
import * as utils from '../utils';

export default {
	name: 'PayoutList',

	props: {
		data: {
			type: Array,
			required: true
		},
		language: {
			type: String,
		},
	},

	mounted() {
		this.transactions = [];
		let animationArray = [... this.data];
		const timer = setInterval(() => {
			if(!animationArray.length)
				clearInterval(timer);
			this.transactions.push(animationArray.shift());
		}, 100)
	},

	data() {
		return {
			IncomingIcon,
			transactions: []
		}
	},

	methods: {
		formatAddress(address) {
			return utils.trunc(address, 'middle', 7, 4);
		},

		formatMosaic(mosaics) {
			return utils.getNativeMosaicPreview(mosaics)
		},

		formatDate(date) {
			return utils.formatDate(date, this.language)
		},
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

.transactions-container {
	width: 100%;
	max-width: 400px;
	box-shadow: inset 0px 0px 40px rgba(67, 0, 78, 0.5);
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
	width: 30%;
	align-items: center;
}

.icon {
	height: 20px;
}

.address {
	color: #333;
	font-size: 10px;
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

@keyframes fadein {
	from { opacity: 0; }
	to   { opacity: 1; }
}

</style>