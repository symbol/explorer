<template>
	<div>
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			:width="getPixels(transactionGraphicWidth)"
			:height="getPixels(transactionGraphicHeight)"
			:viewBox="transactionGraphicViewbox"
			xml:space="preserve"
		>
			<AccountIcon
				:x="subjectPositionX"
				:y="subjectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:address="signer"
			/>
			<AccountIcon
				:x="objectPositionX"
				:y="objectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:address="signer"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<RestrictionAddressCircle
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:title="restrictionType"
				:data="restrictionAddress"
			/>
			<text :x="transactionTypeTextPositionX" :y="transactionTypeTextPositionY" text-anchor="middle" class="message">
				{{ transactionType  }}
				<title>{{ transactionType }}</title>
			</text>
		</svg>
	</div>
</template>

<script>
import GraphicComponent from '../graphics/GraphicComponent.vue';
import AccountIcon from '../graphics/AccountIcon.vue';
import RestrictionAddressCircle from '../graphics/RestrictionAddressCircle.vue';
import Arrow from '../graphics/Arrow.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		RestrictionAddressCircle,
		Arrow
	},

	props: {
		type: {
			type: Number,
			required: true,
			default: TransactionType.ACCOUNT_ADDRESS_RESTRICTION
		},
		signer: {
			type: String,
			required: true,
			default: ''
		},
		restrictionType: {
			type: String,
			required: true,
			default: ''
		},
		restrictionAddressAdditions: {
			type: Array,
			default: () => []
		},
		restrictionAddressDeletions: {
			type: Array,
			default: () => []
		}
	},

	computed: {
		transactionType () {
			return this.getTransactionTypeCaption(this.type);
		},

		circleIconsToDisplay () {
			return [true];
		},

		restrictionAddress () {
			return {
				added: this.restrictionAddressAdditions,
				removed: this.restrictionAddressDeletions
			};
		}
	}
};
</script>
