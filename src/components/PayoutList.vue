<template>
	<div class="payout-root">
		<div class="transactions-container">
			<div class="transactions-wrapper">
				<div class="transaction-item">
					<img :src="IncomingIcon" class="icon" />
					<div class="address">
						TBFJVJ-VCW2VU-L5MT6X-XXU7EI-YTOKC5-NV2FRK-NVA
					</div>
					<div class="date">
						Dec 18, 2020
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import IncomingIcon from '../assets/incoming.png';

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

	computed: {
	},

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

.date {
	color: #999;
	font-size: 10px;
}

</style>