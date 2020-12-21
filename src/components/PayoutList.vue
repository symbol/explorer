<template>
	<div class="payout-root">
		<div class="transactions-container">
			<div class="transactions-wrapper">
				<div
					v-for="(transaction, index) in data"
					:key="'' + index + 'payout'"
					class="transaction-item"
				>
					<img :src="IncomingIcon" class="icon" />
					<div class="address">
						{{formatAddress(transaction.recipientAddress)}}
					</div>
					<div class="amount">
						{{formatMosaic(transaction.mosaics)}}
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
import utils from '../unils';

export default {
	name: 'PayoutList',

	props: {
		data: {
			type: Object,
			required: true
		},
		language: {
			type: String,
		},
	},

	data() {
		return {
			IncomingIcon
		}
	},

	methods: {
		formatAddress(address) {
			return utils.trunc(address, 'middle', 7, 4);
		},

		formatMosaic(mosaics) {
			return mosaics[0]
		},

		formatDate(date) {
			return utils.formatDate(date, language)
		},
	}

}
</script>

<style lang="scss" scoped>
.payout-root {
	// height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
}

.transactions-container {
	width: 100%;
	max-width: 400px;
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

.date {
	color: #999;
	font-size: 10px;
}

</style>